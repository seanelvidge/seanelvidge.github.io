---
layout: post
title: Safe Reboot of Locked Linux Machine
date: 2015-03-20 11:29:00-0400
description: How to safely reboot a locked linux machine
tags: linux
related_posts: true
---

The magic SysRq (system request) allows you to access a low-level message system in the kernel. This will work as long as there hasn’t been a kernel panic, and can provide you with a way of rescuing the system. To access the key combination you need to hold **Alt + SysRq + Command** where command is the specific feature you want to access. The SysRq key is usually the same as the Print Screen key. A table of the available commands are found at the table at the bottom of this article, but the main one you will probably use is:

```bash
Alt + SysRq + REISUB              (slowly type the R E I S U B)
```

This will kill all process except init, sync the mounted file systems, remount the file systems in read-only mode and reboot the system. There are a few ways to try and remember the order REISUB, the one I use is “Reboot Even If System Utterly Broken”, you could also just remember that it is ‘BUSIER’ backwards. Hope it comes in handy, here is the table of all the commands:

| Command | Description |
|---------|-------------|
| 0-9     | Set the console log level, i.e., change the type of kernel messages that are output |
| b       | Immediately reboot the system, without unmounting or syncing filesystems |
| c       | Perform a system crash. A crashdump will be taken if configured. |
| d       | Display all currently held locks |
| e       | Send the SIGTERM signal to all processes except init (PID 1) |
| g       | Emergency support for switching back to the kernel’s framebuffer console |
| h       | Output a terse help document to the console |
| i       | Send the SIGKILL signal to all processes except init |
| j       | Forcibly “Just thaw it” – filesystems frozen by the FIFREEZE ioctl |
| k       | Kill all processes on the current virtual console |
| l       | Shows a stack backtrace for all active CPUs |
| m       | Output current memory information to the console |
| n       | Reset the nice level of all high-priority and real-time tasks |
| o       | Shut off the system |
| p       | Output the current registers and flags to the console |
| q       | Display all active high-resolution timers and clock sources |
| r       | Switch the keyboard from raw mode |
| s       | Sync all mounted filesystems |
| t       | Output a list of current tasks and their information to the console |
| u       | Remount all mounted filesystems in read-only mode |
| v       | Forcefully restores framebuffer console |
| w       | Display list of blocked tasks |
| y       | Show global CPU registers (SPARC-64 specific) |
| z       | Dump the ftrace buffer |
