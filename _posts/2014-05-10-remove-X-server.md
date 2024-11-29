---
layout: post
title: Quick way to remove X Server for running a headless server
date: 2014-05-10 07:35:00
description: Remove X Server
tags: misc
related_posts: true
---

I use my Raspberry Pi as a headless server so do not need anything that relies on X11, this is a quick way to get rid of everything that depends on X11 to save some space.

Although you can get Raspberry Pi OSs which are very minimal (i.e. do not start with the X Server) I’ve found that [Raspbian](https://www.raspberrypi.com/software/) is the most stable (Debian-based) OS for the Raspberry Pi, and so that is what I use. It is also really easy to set up to use as a headless server.

Flash the OS to your SD card, boot your Raspberry Pi with it and as long as you have a wired internet connection to it, no need to use a screen. Simply SSH into the machine with the username 'pi' and password 'raspberry' (if you aren’t sure what the IP address of your Pi is you can either look on your router or I find using the Android App [Fing](https://play.google.com/store/apps/details?id=com.overlook.android.fing) the easiest way).

The first time you login you may want to run the Raspbian config programme:

```bash
sudo raspi-config
```

Now the quick way to remove X11:

```bash
sudo apt-get remove --auto-remove --purge libx11-.*
```

The '–purge' command in apt-get will remove everything which is associated with libx11, a nice quick way to save a load of space. If you so wish you can always check if a particular package is installed or not with:

```bash
apt-cache policy package
```

Where package is the package you want to check if it is installed or no. If it is installed the version number will be returned if not you will some text including the line 'Installed: (none)'.
