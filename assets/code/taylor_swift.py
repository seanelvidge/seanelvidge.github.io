# analyze_melody_pitch_ide.py
from __future__ import annotations
import os
import csv
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed

import numpy as np
import librosa
import librosa.effects
import scipy.signal as sig

# ---------- Core processing (unchanged) ----------
EXTS = {'.mp3', '.wav', '.m4a', '.flac', '.ogg'}

def midi_to_note_rounded(m):
    return librosa.midi_to_note(round(m), octave=True)

def process_file(
    path: Path,
    fmin_note: str,
    fmax_note: str,
    trim_top_db: int,
    bandpass_hz: tuple[float, float],
    frame_length: int,
    hop_length: int
) -> dict:
    rec = {
        "file": str(path),
        "median_note": "",
        "median_midi": "",
        "weighted_note": "",
        "weighted_midi": "",
        "voiced_ratio": "",
        "frames_total": "",
        "frames_voiced": "",
        "sr": "",
        "error": ""
    }
    try:
        # 1) Load at native SR
        y, sr = librosa.load(str(path), sr=None, mono=True)
        rec["sr"] = sr

        # 2) Trim silence
        y, _ = librosa.effects.trim(y, top_db=trim_top_db)
        if y.size == 0:
            rec["error"] = "Empty after trim"
            return rec

        # 3) HPSS -> keep harmonic
        y_harm, _ = librosa.effects.hpss(y)

        # 4) Band-pass around vocal/melody region
        low, high = bandpass_hz
        nyq = sr / 2
        low = max(5.0, min(low, nyq * 0.9))
        high = max(low * 1.1, min(high, nyq * 0.99))
        b, a = sig.butter(4, [low/nyq, high/nyq], btype="bandpass")
        y_focus = sig.filtfilt(b, a, y_harm)

        # 5) Pitch tracking (PYIN)
        fmin = librosa.note_to_hz(fmin_note)
        fmax = librosa.note_to_hz(fmax_note)
        f0, voiced_flag, _ = librosa.pyin(
            y_focus,
            fmin=fmin, fmax=fmax,
            frame_length=frame_length, hop_length=hop_length
        )

        frames_total = f0.shape[0]
        frames_voiced = int(np.count_nonzero(voiced_flag))
        rec["frames_total"] = frames_total
        rec["frames_voiced"] = frames_voiced
        rec["voiced_ratio"] = (frames_voiced / frames_total) if frames_total else 0.0

        if frames_voiced == 0:
            rec["error"] = "No voiced frames (raise fmin_note or loosen band-pass)"
            return rec

        f0_v = f0[voiced_flag]
        midi = librosa.hz_to_midi(f0_v)

        # Energy weights
        rms = librosa.feature.rms(y=y_focus, frame_length=frame_length, hop_length=hop_length).flatten()
        rms_v = rms[voiced_flag]
        weights = rms_v / (np.sum(rms_v) + 1e-12)

        median_midi = float(np.median(midi))
        weighted_midi = float(np.sum(midi * weights))

        rec["median_midi"] = round(median_midi, 2)
        rec["weighted_midi"] = round(weighted_midi, 2)
        rec["median_note"] = midi_to_note_rounded(median_midi)
        rec["weighted_note"] = midi_to_note_rounded(weighted_midi)

        return rec

    except Exception as e:
        rec["error"] = f"{type(e).__name__}: {e}"
        return rec

def find_audio_files(folder: Path):
    for p in folder.rglob("*"):
        if p.is_file() and p.suffix.lower() in EXTS:
            yield p

def run_batch(
    input_folder: str,
    output_csv: str,
    fmin_note: str,
    fmax_note: str,
    low_hz: float,
    high_hz: float,
    trim_top_db: int,
    frame_length: int,
    hop_length: int,
    workers: int
):
    folder = Path(input_folder)
    files = list(find_audio_files(folder))
    if not files:
        raise SystemExit(f"No audio files with {sorted(EXTS)} found under {folder}")

    print(f"Found {len(files)} files. Processing with {workers} workers...")
    bandpass_hz = (low_hz, high_hz)

    results = []
    with ProcessPoolExecutor(max_workers=workers) as ex:
        futs = {
            ex.submit(
                process_file, p, fmin_note, fmax_note, trim_top_db,
                bandpass_hz, frame_length, hop_length
            ): p for p in files
        }
        for fut in as_completed(futs):
            rec = fut.result()
            results.append(rec)
            fname = Path(rec["file"]).name
            if rec["error"]:
                print(f"[!] {fname}: {rec['error']}")
            else:
                print(f"[OK] {fname}: {rec['median_note']} / {rec['weighted_note']} "
                      f"(voiced {rec['voiced_ratio']:.2f})")

    header = ["file","median_note","median_midi","weighted_note","weighted_midi",
              "voiced_ratio","frames_total","frames_voiced","sr","error"]
    out_path = Path(output_csv)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for r in results:
            w.writerow(r)

    print(f"\nSaved: {out_path.resolve()}")

if __name__ == "__main__":
    # Set your variables here
    INPUT_FOLDER   = r"~\Taylor Swift - Fearless"
    OUTPUT_CSV     = r"~\summary.csv"

    # Pitch tracking bounds (tighten/raise fmin_note if results skew low)
    FMIN_NOTE      = "C3"     # try "D3"/"E3" for even stronger low-cut
    FMAX_NOTE      = "C6"

    # Band-pass to emphasize vocal/melody region (Hz)
    LOW_HZ         = 130.0
    HIGH_HZ        = 1200.0

    # Pre/post processing
    TRIM_TOP_DB    = 30
    FRAME_LENGTH   = 2048
    HOP_LENGTH     = 256

    # Parallelism
    WORKERS        = max(1, os.cpu_count() - 1)

    run_batch(
        input_folder=INPUT_FOLDER,
        output_csv=OUTPUT_CSV,
        fmin_note=FMIN_NOTE,
        fmax_note=FMAX_NOTE,
        low_hz=LOW_HZ,
        high_hz=HIGH_HZ,
        trim_top_db=TRIM_TOP_DB,
        frame_length=FRAME_LENGTH,
        hop_length=HOP_LENGTH,
        workers=WORKERS
    )
