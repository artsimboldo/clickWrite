clickWrite
==========

Experiment with Johnson-Laird's Procedural Semantics on spatial reasonning, language-games, webGL and text generation based menu interface.

![](snapshot.png)

### Instructions
Simply double-click `clickWriteSpatialdemo.html`.  

### Description
This is my implementation of the REMAKE procedure described in Johnson-Laird book (see references below, chapter 11). The theory assumes that there are procedures that construct the basis of the meanins of expressions. In this simple example, the mental model is represented by a spatial array of objects (coloured cubes). Assertions are entered using a menu based interface in plain french. From menu options, a system has been developed to re-generate grammatically correct sentences from inputs. Menu navigation is declared through a data structure I'm calling a "game", since it's inpired from Wittgenstein's language-games. A "game" is a graph connecting idioms to represent a family of meanings regrouped towards a specific activity e.g. place cubes each relatively to each other. 

A sentence is described as A simple colour schema describe possible actions in menus (or anchors):
- Blue anchor: no more sub-options available, the anchor is completed.
- Red anchor: choosing a sub-option is mandatory, the sentence will not be interpreted.
- Green anchor: sub-options may be chosen, but the sentence can be interpreted with default settings.

When assertions are entered, they are checked against the mental model to determine whether they are true or false.

### Example of a game

![](models/game.gif)

### References
- Johnson-Laird, Philip N (1983). Mental Models: Toward a Cognitive Science of Language, Inference and Consciousness. Harvard University Press.
- Roger Evans and Richard Power (2003) WYSIWYM: building user interfaces with natural language feedback. Research notes and demonstration papers at EACL-03, pp. 203-206, Budapest, Hungary.
