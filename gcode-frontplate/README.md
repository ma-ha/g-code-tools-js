# How To Use

1st Step: Generate the G-Code, e.g.

    ./gode-gen.js examples/A-Z0-9.json > examples/A-Z0-9.gcode 

2nd Step: IMPORTANT: all files start with G92 to zero the coorinates from the current position

So move the tool to the desired (0,0) point, and move the z-axis down, so the tool touches the surface slightly.
(Hint: i use s sheet of paper, if I can't move it any more, it is OK ;-) 

# Minimal JSON Input

    { 
      "PrjName": "Example",
      "ToolDia": 3.0,
      "SafeHeight": 3,
      "CutSpeed":200,
      "SpindleSpeed":1000,
      "z": -2.5,   
      "Template": {
        "AudioCh": [
          { "type": "Circle", "x":10, "y": 10, "r":10, "descr":"a circle  },
        ]
      },
      "DoTemplates": [
        { "Template": "Test", "x":  0.0, "y":  0.0, "descr":"Test" }
      ]
    }


z: deepth to cut in mm


See [exampels folder](examples/) for more advanced JSON.