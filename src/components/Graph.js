import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Graph({ attributes, fetchedAttributes, onUpdateAttributes, onDeleteAttribute }) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 600)
      .attr('height', 600)
      .style('background', '#f9f9f9')
      .style('margin-top', '50px')
      .style('overflow', 'visible');

    const centralNode = { x: 300, y: 300, r: 50, text: 'Object' };

    const radiusAttributes = 200;
    const attributeNodes = attributes.map((attr, index) => ({
      x: centralNode.x + radiusAttributes * Math.cos(2 * Math.PI * index / attributes.length),
      y: centralNode.y + radiusAttributes * Math.sin(2 * Math.PI * index / attributes.length),
      r: 30,
      text: attr
    }));

    const radiusFetchedAttributes = 300;
    const fetchedAttributeNodes = fetchedAttributes.map((attr, index) => ({
      x: centralNode.x + radiusFetchedAttributes * Math.cos(2 * Math.PI * index / fetchedAttributes.length),
      y: centralNode.y + radiusFetchedAttributes * Math.sin(2 * Math.PI * index / fetchedAttributes.length),
      r: 30,
      text: attr
    }));

    const nodes = [centralNode, ...attributeNodes, ...fetchedAttributeNodes];

    svg.selectAll('*').remove(); // Clear existing elements

    const links = svg.selectAll('.link')
      .data(attributeNodes.map(node => ({ source: centralNode, target: node })))
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#ccc')
      .attr('stroke-width', '2');

    const fetchedLinks = svg.selectAll('.fetchedLink')
      .data(fetchedAttributeNodes.map(node => ({ source: centralNode, target: node })))
      .enter()
      .append('line')
      .attr('class', 'fetchedLink')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#ccc')
      .attr('stroke-width', '2')
      .attr('stroke-dasharray', '5,5');

    const nodeElements = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .on('dblclick', (event, d) => {
        if (d !== centralNode) {
          const newText = prompt('Enter new text:', d.text);
          if (newText !== null && newText !== '') {
            onUpdateAttributes(d.text, newText);
          }
        }
      })
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        if (d !== centralNode) {
          const confirmDelete = window.confirm(`Delete attribute "${d.text}"?`);
          if (confirmDelete) {
            onDeleteAttribute(d.text);
          }
        }
      });

    nodeElements.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => (d === centralNode) ? '#69b3a2' : '#6a0dad')
      .attr('cursor', d => (d === centralNode) ? 'default' : 'pointer');

    nodeElements.append('text')
      .attr('dx', -20)
      .attr('dy', 5)
      .text(d => d.text);
  }, [attributes, fetchedAttributes, onUpdateAttributes, onDeleteAttribute]);

  return <svg ref={svgRef}></svg>;
}

export default Graph;
