# detect-scroll-bottom
Detect when a user scrolls to and from the bottom of a scrollable HTML element. 0 Dependencies.

## How it works

Executes a callback when the user's scroll position hits the bottom of the container. Executes callback once more when the user scrolls up. This is useful for determining an intent to watch real-time streaming content. 

## Goal

The goal is to create behavior similar to unix `tail -f`, such that when a user scrolls to the bottom, they are "locked" onto new content. When the user scrolls up, they can "unlock" from the real-time content in order to read previous content.

## Future Goals

Add this to npm.

