---
layout: post
title: Batch Process in Bash
date: 2011-03-18 02:30:00
description: How to do the same process on a large number of files in Bash
tags: code bash
---

I am writing this at 0230 because Joe just asked me how to do it, hence someone else in the world might also want to do it. The task is to do something (the same something) to a large group of files in linux. For example convert a folder of wma files to mp3's (for this example you will need to have ffmpeg installed). We add the condition that we want to keep the file names as they are, and just convert them.

It is fairly simple, we will write a script to do this (although you could do it straight from the terminal), for this example we will write a script called _wma2mp3_:

```bash
gedit wma2mp3
```

(Obviously change gedit for your favourite editor). Now add to that:

```bash
for i in *.wma; do
filename=${i%.*}
ffmpeg -i "$filename.wma" "$filename.mp3"
done
```

Then all you need to do is place that file in the folder where you want to run it, then run it, and then you're done! Again this is just an example and you can modify this to anything you want. If you actually want to change wma's to mp3's there are a few more options you may want to use, but I thought this would be a better 'template'. 

For one more example, say you want to convert all your ps files in a folder to pdf's (here you will need to have ps2pdf installed) we would use:

```bash
for i in *.ps; do
filename=${i%.*}
ps2pdf "$filename.ps" "$filename.pdf"
done
```

Hope that helps!
