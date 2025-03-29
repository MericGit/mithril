// This is a simplified version of the world topology
export const worldTopology = {
  "type": "Topology",
  "objects": {
    "countries": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "properties": { "name": "United States" },
          "arcs": [[0, 1, 2, 3, 4, 5]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "China" },
          "arcs": [[6, 7, 8, 9, 10]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "Russia" },
          "arcs": [[11, 12, 13, 14, 15]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "European Union" },
          "arcs": [[16, 17, 18, 19, 20]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "North Korea" },
          "arcs": [[21, 22, 23, 24, 25]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "Iran" },
          "arcs": [[26, 27, 28, 29, 30]]
        },
        {
          "type": "Polygon",
          "properties": { "name": "India" },
          "arcs": [[31, 32, 33, 34, 35]]
        }
      ]
    }
  },
  "arcs": [
    // These are simplified arc coordinates
    [[40, -100], [37, -120], [35, 105], [30, 114], [55, 37], [50, 10]],
    [[48, 2], [40, 127], [32, 53], [20, 77], [40, -100], [37, -120]],
    [[35, 105], [30, 114], [55, 37], [50, 10], [48, 2], [40, 127]],
    [[32, 53], [20, 77], [40, -100], [37, -120], [35, 105], [30, 114]],
    [[55, 37], [50, 10], [48, 2], [40, 127], [32, 53], [20, 77]],
    [[40, -100], [37, -120], [35, 105], [30, 114], [55, 37], [50, 10]]
  ]
}
