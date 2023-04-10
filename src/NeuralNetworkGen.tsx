import React, {useState, useEffect} from 'react';
type LayerConfig = number[];

function generateCSS(layers: number): string {
    const css = [];
    const endPercent = 90;
    const turnTime = 75 / layers;
    const duration = 2.75;
    const delay = 0.25;
    const tween = "ease-in";
    const dashoffset = 160;
    const dasharray = 150;
    css.push(`
    line {
        stroke-dashoffset: ${dashoffset};
        stroke-dasharray: ${dasharray};
    }
    @keyframes circleFade {
        0% {
          opacity: 0;
        }
        ${Math.floor(100*delay/duration)}% {
            opacity: 1;
        }
        ${endPercent}% {
            opacity: 1;
        }
        100% {
          opacity: 0;
        }
    }
    circle {
    animation: circleFade ${duration + delay}s ease-in-out;
    animation-fill-mode: both;
    }
    `);
    for (let i = 0; i < layers - 1; i++) {
        css.push(`
        @keyframes neuron${i} {
            ${Math.floor(turnTime*i)}% {
              stroke-dashoffset: ${dashoffset};
            }
            ${Math.floor(turnTime*(i+1))}% {
              stroke-dashoffset: 0;
            }
            ${endPercent}% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              opacity: 0;
              stroke-dashoffset: 0;
            }
          }
        .neuron${i} {
            animation: neuron${i} ${duration}s ${delay}s ${tween} infinite;
        }
        `);
    }
    return css.join('');
}

function createNeuralNetwork(layers: LayerConfig): string {
  // Drawing settings
  const nodeRadius = 5;
  const nodeSpace = 20;
  const layerSpace = 70;
  const width = (layers.length - 1) * layerSpace + 100;
  const height = 6 * nodeSpace;

  const svg: string[] = [];
  svg.push(`<svg width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1" >`);

  // Add nodes
  layers.forEach((layer, i) => {
    const x = 50 + i * layerSpace;
    const yStart = (height - (layer - 1) * nodeSpace) / 2;

    for (let j = 0; j < layer; j++) {
      const y = yStart + j * nodeSpace;
      svg.push(`<circle cx="${x}" cy="${y}" r="${nodeRadius}" />`);
    }
  });

  // Add connections
  layers.slice(0, -1).forEach((layer, i) => {
    const x1 = 50 + i * layerSpace + nodeRadius;
    const y1Start = (height - (layer - 1) * nodeSpace) / 2;
    const nextLayer = layers[i + 1];
    const x2 = x1 + layerSpace - 2 * nodeRadius;
    const y2Start = (height - (nextLayer - 1) * nodeSpace) / 2;

    for (let y1Idx = 0; y1Idx < layer; y1Idx++) {
      const y1 = y1Start + y1Idx * nodeSpace;
      for (let y2Idx = 0; y2Idx < nextLayer; y2Idx++) {
        const y2 = y2Start + y2Idx * nodeSpace;
        svg.push(`<line class="neuron${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ></line>`);
      }
    }
  });
  const cssGen = generateCSS(layers.length);
  svg.push(`</svg>`);
  svg.push(`<style>${cssGen}</style>`);
  return svg.join('');
}

function randomLayer(min = 2, max = 4){
    return Math.floor(Math.random() * max) + max-min+1;
}

export default function NeuralNetworkGen() {
    const [layers, setLayers] = useState<LayerConfig>([randomLayer(),4,5,1]);

    useEffect(() => {
        const intervalId = setInterval(() => {
          const numLayers = Math.floor(Math.random() * 2) + 3;
          const newLayers: LayerConfig = [];
          for (let i = 0; i < numLayers-1; i++) {
              newLayers.push(randomLayer());
          }
          newLayers.push(1);
          setLayers(newLayers);
        }, 3000);

      }, []);
    
    const neuralNetworkSVG = createNeuralNetwork(layers);
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: neuralNetworkSVG }} />
        </div>
    );
}