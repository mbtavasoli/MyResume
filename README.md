# My Résumé Page

This single-page résumé was built only with **HTML**, **CSS**, and **JavaScript**, without any external frameworks.

## Key Interactive Features

### 1. Network Graph Animation

- Since my field is networking, I added a network graph in the canvas which is rendered in the background.
- Every time the page is loaded, 130 nodes are generated in random positions with spatial constraints and linked based on proximity.
- When the user moves the mouse over the graph:
  - Nearby nodes are slightly repelled.
  - When the mouse leaves, nodes return to their original positions.

### 2.  Name Color Interaction

- The header (my full name) text dynamically changes color as the mouse moves over it.
- The color is calculated based on the mouse position relative to the window.
- A `linear-gradient` and `background-clip: text` technique is used for the effect.

### 3.  Animated Skill Progress Bars

- Each skill is shown with an animated progress bar.
- On clicking the "Skills" tab:
  - Each progress bar, which is inside the progress container div, grows from 0 to its target value using a cubic-bezier transition.
    
### 4.  Image Gallery
- A small image carousel with three photos:
  - Dots for navigation, each clickable to jump to that image, plus next and previous icon buttons.
- All image data (title, caption, src) is defined in an array.
