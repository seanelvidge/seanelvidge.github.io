---
layout: post
title: Making Files and Folders Lowercase
date: 2013-10-21 12:32:00
description: How to make all files lowercase 
tags: linux
related_posts: true
---

Very occasionally I want to make all the files and folders of a particular directory lowercase (usually when porting an existing directory structure from Windows to Linux) this is how I do it. 

You could set up some form of recursive renaming script in a similar fashion to my post on [Batch Process in Bash](https://seanelvidge.github.io/blog/2011/batch-process-in-bash/). But it is much nicer to do it in just the one line, assume we want to change all the file and folder names inside the folder '/home/sean/windows/':

```bash
find /home/sean/windows/ -depth -exec rename 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;
```

Job done!
