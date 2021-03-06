clickWrite
==========

Experiment with Johnson-Laird's Procedural Semantics on spatial reasonning, language-games, [WebGL](http://scenejs.org/) and text generation based menu interface.

![](snapshot.png)

### Instructions
Simply double-click `clickWriteSpatialdemo.html`. Tested in Chrome.

### Description
This is my implementation of the REMAKE recursive procedure described in Johnson-Laird's book (see [3], chapter 11). The theory assumes that there are procedures that construct the basis of the meanings of expressions. In this simple example, the mental model is represented by a spatial array of objects (coloured cubes). Assertions are entered using a menu based interface in plain french. From menu options, a system has been developed to re-generate grammatically correct sentences from inputs, as proposed in the WYSIWYM approach [4]. 

A sentence is syntactically inspired by a dependency model ala Tesniere [1], where verbs occupy the root position of a structure pointing to subordinated terms (nodes); namely a subject and a complement. The whole structure is called a stemma, from which each node can be instantiated independently to create a sentence using a mouse or a touch-based simple interface. Stemmata are transformed to predicates when asserted.

Each node is associated to an anchor that could lead to possible words or syntactic roles. Menu navigation is declared through a semantic network I'm calling a "game", since it's inspired from Wittgenstein's language-games [2]. A "game" is a semantic network connecting idioms to represent a family of meanings regrouped towards a specific activity e.g. place cubes relatively to each other. From games, we can deduce subordinated nodes to expand or detail the sentence from meaningful and syntactically correct new constituants.

A simple colour schema describe possible anchors at a certain state of the sentence:
- Blue anchor: no more sub-options available, the anchor is completed.
- Red anchor: choosing a sub-option is mandatory, the sentence will not be interpreted.
- Green anchor: sub-options may be chosen, but the sentence can be interpreted with default settings.

When assertions are entered, they are checked against the mental model to determine whether they are true or false.

##### Example of a game
![](models/game.gif)

### Reference
- [1] Tesnière, Lucien (1959). Éléments de syntaxe structurale, Klincksieck, Paris.
- [2] Wittgenstein, Ludwig (1953). Philosophical Investigations, Blackwell.
- [3] Johnson-Laird, Philip N (1983). Mental Models: Toward a Cognitive Science of Language, Inference and Consciousness, Harvard University Press.
- [4] Roger Evans and Richard Power (2003) WYSIWYM: building user interfaces with natural language feedback, Research notes and demonstration papers at EACL-03, pp. 203-206, Budapest, Hungary.
