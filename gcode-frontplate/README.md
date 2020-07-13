# G-Code Generator

Utility to create G-Code for drilling, milling and text engraving from a simple JSON input file.

The generator can generate G-Code for:
* Drill holes
* Rectangles
* Circles
* Text Engraving

Rectangles and Circles are done in a spiral rough cut and a last fine cut.

WARNING: USE AT YOUR OWN RISK! 

Please learn a little bit of G-Code (it is easy) to understand what you are doing: 
https://www.reprap.org/wiki/G-code

I.e. have a look at `M3`/`M5`/`G2`/`G21`/`G92`/`G0`/`G1`/`G2`/`G3`

# Installation

    sudo npm install --global gcode-gen

# How To Use

IMPORTANT: all files start with G92 to zero the coordinates from the current position. 
You must remove it from the output if you want a different behavior.

## 1st Step: Generate the G-Code

Example:

    gode-gen examples/A-Z0-9.json > examples/A-Z0-9.gcode 

## 2nd step: Double check the G-Code output

BTW: [CAMotics](https://camotics.org/) is a great tool toto review the G-Code in 3d


## 3nd Step: Prepare and run the machine

IMPORTANT: all files start with `G92` to set the current position as zero coordinates.

Move the tool to the desired (0,0) point, and move the z-axis down, so the tool touches the surface slightly.
(Hint: i use s sheet of thin paper - if I can't move it any more, it is OK ;-)

Use your favorite G-Code sender tool - I use [GRBL Controller ](https://github.com/zapmaker/GrblHoming/releases)


# Example JSON Input

    { 
      "PrjName": "Example",
      "ToolDia": 3.0,
      "SafeHeight": 3,
      "CutSpeed":200,
      "SpindleSpeed":1000,
      "z": -2.5,
      "passes": 4,
      "Template": {
        "AudioCh": [
          { "type": "Circle", "x":10, "y": 10, "r":10, "descr":"a circle  },
        ]
      },
      "DoTemplates": [
        { "Template": "Test", "x":  0.0, "y":  0.0, "descr":"Test" }
      ]
    }

JSON explained:

* "ToolDia": in mm
* "CutSpeed": feed rate in mm per min (optional, default 200)
* "z": negative value, depth to cut in mm (or material thickness + some 1/10 mm)
* "fontZ": optional (negative mm) depth for text engravings
* "passes": passes to cut to z depth (optional, default 4)
* "fine": number in mm to reduce size for raw cut of rectangle/circle, then cut this to final size
* "Template": named lists of objects of:
  * "type": "Drill"
    thru drill at "x", "y"
  * "type": "Circle"
    center "x", "y" and radius "r"
  * "type": "Rectangle"
    center "x", "y", width "w" and height "h"
  * "type": "Text"
    left lower corner "x", "y", the "text" to engrave and the "size" in mm
    * optional: "mirror": true
    * optional: rotation "dir" in degree
  * "type": "Template" to re-use other templates
* "DoTemplates": list of templates to process with specified "x" and "y" 

Each object can have a "descr" text, which is used in a comment.

See [examples folder](examples/) for more JSON examples.

# Text Engraving

The "text can be capital letters, numbers, space and a "-". Text can be rotated and/or mirrored. 

    { 
      "PrjName": "Text Rotation Example",
      "ToolDia": 3.0,
      "SafeHeight": 3,
      "CutSpeed":200,
      "SpindleSpeed":1000,
      "fontZ": -0.05,
      "Template": {
        "TextRot": [
          { "type": "Text", "x":0, "y": 0, "text":" - ACBD-", "size":4, "dir": 45, "descr":"Text 90° mirrored" },
          { "type": "Text", "x":0, "y": 0, "text":" - ACBD-", "size":4, "dir":180, "mirror": true, "descr":"Text 90° mirrored" }
        ]
      },
      "DoTemplates": [
        { "Template": "TextRot", "x":  0.0, "y":  0.0, "descr":"Test" }
      ]
    }

You can modify, extend the fonts or create your own fonts: 
Clone the repo locally and edit `gode-gen.js` and modify the functions `initArialNormal` or `initArialSmall`.
You can use the [gCodeABC.js](https://github.com/ma-ha/g-code-tools-js/blob/master/gcode-manipulate/gCodeABC.js) 
helper script to generate fonts from an Inkscape G-Code export.
 