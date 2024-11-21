---
layout: post
title: Unblock IP address from connecting via SSH
date: 2018-03-08 11:46:00
tags: linux
related_posts: true
---

I manage a small cluster at work and occasionally students get their IP address banned by entering the wrong password when logging into the cluster. I don’t fix the problem often enough to remember how to do it, so I thought I’d jot it down here for future reference.

The blocking of IPs is controlled by [Fail2ban](https://www.fail2ban.org/wiki/index.php/Main_Page), which scans log files for IPs which look malicious (e.g. too many password failures, looking for exploits, etc.) and bans them. It does this by updating firewall rules to reject the specific IP.

To see the list of what is being blocked run (in a terminal):

```bash
sudo iptables -L --line-numbers
```

That will give you something like:

```bash
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     udp  --  anywhere             anywhere             udp xxx:xxxxxx
2    ACCEPT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx
3    ACCEPT     udp  --  anywhere             anywhere             udp xxx:xxxxxx
4    ACCEPT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx
5    f2b-sshd   tcp  --  anywhere             anywhere             multiport dports ssh
6    REJECT     tcp  --  anywhere             anywhere             tcp spts:xxxxxx:xxxxxx dpt:ulistproc reject-with icmp-port-unreachable
7    REJECT     udp  --  anywhere             anywhere             udp spts:xxxxxx:xxxxxx dpt:ulistproc reject-with icmp-port-unreachable
8    ACCEPT     all  --  anywhere             anywhere
9    ACCEPT     all  --  anywhere             anywhere
10   ACCEPT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx state NEW
11   ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
12   ACCEPT     tcp  --  xxx.xxx.xxx.xxx/24   anywhere             tcp xxx:xxxxxx state NEW
13   ACCEPT     tcp  --  xxx.xxx.xxx.xxx/24   anywhere             tcp xxx:xxxxxx state NEW
14   REJECT     udp  --  anywhere             anywhere             udp xxx:xxxxxx reject-with icmp-port-unreachable
15   REJECT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx reject-with icmp-port-unreachable
16   REJECT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx reject-with icmp-port-unreachable
17   REJECT     tcp  --  anywhere             anywhere             tcp xxx:xxxxxx:0:1023 reject-with icmp-port-unreachable
18   REJECT     udp  --  anywhere             anywhere             udp xxx:xxxxxx:0:1023 reject-with icmp-port-unreachable

Chain FORWARD (policy DROP)
num  target     prot opt source               destination
1    ACCEPT     all  --  anywhere             xxx.xxx.xxx.xxx/24     ctstate RELATED,ESTABLISHED
2    ACCEPT     all  --  xxx.xxx.xxx.xxx/24   anywhere
3    ACCEPT     all  --  anywhere             anywhere
4    REJECT     all  --  anywhere             anywhere             reject-with icmp-port-unreachable
5    REJECT     all  --  anywhere             anywhere             reject-with icmp-port-unreachable
6    ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
7    ACCEPT     all  --  anywhere             anywhere

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     udp  --  anywhere             anywhere             udp dpt:bootpc

Chain f2b-sshd (1 references)
num  target     prot opt source               destination
1    REJECT     all  --  xxx.xxx.xxx.xxx      anywhere             reject-with icmp-port-unreachable
2    REJECT     all  --  199.188.177.166      anywhere             reject-with icmp-port-unreachable
3    RETURN     all  --  anywhere             anywhere
```

What we are interested in is the ‘Chain f2b-sshd’ part at the bottom of the list. Here we can see the (made up) IP address 199.188.177.166 is being banned (“REJECT”). That means that any user trying to SSH into the machine from that IP address will fail. If you have verified that that is the IP address you are expecting and know it is safe to unblock then we can delete the rule using the Chain name (f2b-sshd) and line number (2) using “iptables -D CHAIN LINE_NUMBER” so in this specific case:

```bash
sudo iptables -D f2b-sshd 2
```

To make the change permanent you must save your changes:

```bash
sudo iptables-save
```
