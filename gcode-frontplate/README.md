# How To Use

1st Step: Generate the G-Code, e.g.

    ./gode-gen.js examples/A-Z0-9.json > examples/A-Z0-9.gcode 

2nd Step: IMPORTANT: all files start with G92 to zero the coorinates from the current position

So move the tool to the desired (0,0) point, and move the z-axis down, so the tool touches the surface slightly.
(Hint: i use s sheet of paper, if I can't move it any more, it is OK ;-) 

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
* "z": negative value, deepth to cut in mm (or material thickness + some 1/10 mm)
* "fontZ": optional (negatinve mm) deepth for text engravings
* "passes": passes to cut to z depth (optional, defautl 4)
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

See [exampels folder](examples/) for more JSON examples.