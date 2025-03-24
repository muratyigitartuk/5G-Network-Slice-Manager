import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  // Removing unused imports
  // Refresh as RefreshIcon,
  // Save as SaveIcon,
  // DeviceHub as NetworkIcon
} from '@mui/icons-material';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const TopologyView = ({ slice }) => {
  const svgRef = useRef(null);
  const [viewMode, setViewMode] = useState('logical');
  const [showLabels, setShowLabels] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  // Simulated topology data
  const [topology, setTopology] = useState({
    nodes: [
      { id: 'router1', type: 'router', x: 100, y: 100 },
      { id: 'router2', type: 'router', x: 300, y: 100 },
      { id: 'vnf1', type: 'vnf', x: 200, y: 200 },
      { id: 'vnf2', type: 'vnf', x: 400, y: 200 },
      { id: 'endpoint1', type: 'endpoint', x: 100, y: 300 },
      { id: 'endpoint2', type: 'endpoint', x: 400, y: 300 }
    ],
    links: [
      { source: 'router1', target: 'router2', bandwidth: 100, latency: 5 },
      { source: 'router1', target: 'vnf1', bandwidth: 50, latency: 2 },
      { source: 'router2', target: 'vnf2', bandwidth: 50, latency: 2 },
      { source: 'vnf1', target: 'endpoint1', bandwidth: 25, latency: 1 },
      { source: 'vnf2', target: 'endpoint2', bandwidth: 25, latency: 1 }
    ]
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Create arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Draw links
    const links = g.selectAll(".link")
      .data(topology.links)
      .enter()
      .append("g")
      .attr("class", "link");

    links.append("line")
      .attr("x1", d => topology.nodes.find(n => n.id === d.source).x)
      .attr("y1", d => topology.nodes.find(n => n.id === d.source).y)
      .attr("x2", d => topology.nodes.find(n => n.id === d.target).x)
      .attr("y2", d => topology.nodes.find(n => n.id === d.target).y)
      .attr("stroke", "#999")
      .attr("stroke-width", d => Math.log(d.bandwidth) * 2)
      .attr("marker-end", "url(#arrow)");

    if (showMetrics) {
      links.append("text")
        .attr("x", d => (topology.nodes.find(n => n.id === d.source).x + 
                        topology.nodes.find(n => n.id === d.target).x) / 2)
        .attr("y", d => (topology.nodes.find(n => n.id === d.source).y + 
                        topology.nodes.find(n => n.id === d.target).y) / 2)
        .attr("dy", -5)
        .text(d => `${d.bandwidth}Mbps, ${d.latency}ms`)
        .attr("fill", "#666")
        .attr("font-size", "10px");
    }

    // Draw nodes
    const nodes = g.selectAll(".node")
      .data(topology.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        switch (d.type) {
          case 'router': return '#4CAF50';
          case 'vnf': return '#2196F3';
          case 'endpoint': return '#FFC107';
          default: return '#9E9E9E';
        }
      });

    if (showLabels) {
      nodes.append("text")
        .attr("dy", 30)
        .attr("text-anchor", "middle")
        .text(d => d.id)
        .attr("fill", "#333")
        .attr("font-size", "12px");
    }

  }, [topology, showLabels, showMetrics, viewMode]);

  const handleZoom = (direction) => {
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([0.1, 4]);
    
    if (direction === 'in') {
      svg.transition().call(zoom.scaleBy, 1.2);
    } else {
      svg.transition().call(zoom.scaleBy, 0.8);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Network Topology
          </Typography>
          <Box>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, value) => value && setViewMode(value)}
              size="small"
              sx={{ mr: 2 }}
            >
              <ToggleButton value="logical">Logical</ToggleButton>
              <ToggleButton value="physical">Physical</ToggleButton>
            </ToggleButtonGroup>
            <IconButton onClick={() => handleZoom('in')} size="small">
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={() => handleZoom('out')} size="small">
              <ZoomOutIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
            }
            label="Show Labels"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showMetrics}
                onChange={(e) => setShowMetrics(e.target.checked)}
              />
            }
            label="Show Metrics"
          />
        </Box>
        <Box sx={{ border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
          <svg
            ref={svgRef}
            width="100%"
            height="600"
            style={{ background: '#f5f5f5' }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

TopologyView.propTypes = {
  slice: PropTypes.object.isRequired
};

export default TopologyView; 