import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CircuitNode, WireConnection, ComponentType, GateType } from '../types';
import { presetCircuits } from '../data/presets';
import { evaluateGate } from '../data/exercises';
import { GateSvg } from './GateSvg';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sound';
import {
  Play,
  RotateCcw,
  Trash2,
  Table,
  Zap,
  HelpCircle,
  FolderOpen,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CircuitDesigner: React.FC = () => {
  const { recordCircuitBuilt, soundEnabled, language } = useGameStore();
  const isEl = language === 'el';

  // Circuit state initialized with Half Adder preset for instant exploration
  const [nodes, setNodes] = useState<CircuitNode[]>(presetCircuits[0].nodes);
  const [connections, setConnections] = useState<WireConnection[]>(presetCircuits[0].connections);

  // Interaction state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wiring state
  const [wireStart, setWireStart] = useState<{ nodeId: string; pinIndex: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Clock tick timer
  const [clockTick, setClockTick] = useState<number>(0);

  // Modals
  const [showTruthTableModal, setShowTruthTableModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Clock ticker every 800ms
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTick((prev) => (prev === 0 ? 1 : 0));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  // Update clock nodes on tick
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => (n.type === 'CLOCK' ? { ...n, state: clockTick } : n))
    );
  }, [clockTick]);

  // Helper to determine node pin count
  const isSingleInputNode = (type: ComponentType) => {
    return type === 'NOT' || type === 'BUFFER' || type === 'LED' || type === 'PROBE';
  };

  const isInputSource = (type: ComponentType) => {
    return (
      type === 'SWITCH' ||
      type === 'PUSH' ||
      type === 'CLOCK' ||
      type === 'CONST_1' ||
      type === 'CONST_0'
    );
  };

  const isOutputSink = (type: ComponentType) => {
    return type === 'LED' || type === 'PROBE' || type === 'SEVEN_SEGMENT';
  };

  // Iterative circuit logic simulator
  const simulateCircuit = useCallback(
    (currentNodes: CircuitNode[], currentWires: WireConnection[]) => {
      const nodeOutputs: Record<string, number> = {};

      // 1. Initialize input sources
      currentNodes.forEach((node) => {
        if (node.type === 'SWITCH' || node.type === 'PUSH' || node.type === 'CLOCK') {
          nodeOutputs[node.id] = node.state ?? 0;
        } else if (node.type === 'CONST_1') {
          nodeOutputs[node.id] = 1;
        } else if (node.type === 'CONST_0') {
          nodeOutputs[node.id] = 0;
        }
      });

      // 2. Multi-pass propagation for gate dependencies
      for (let pass = 0; pass < 6; pass++) {
        currentNodes.forEach((node) => {
          if (isInputSource(node.type)) return;

          // Find wires coming into this node
          const inWires = currentWires.filter((w) => w.toNodeId === node.id);
          const wireA = inWires.find((w) => w.toPinIndex === 0);
          const wireB = inWires.find((w) => w.toPinIndex === 1);

          const valA = wireA && nodeOutputs[wireA.fromNodeId] !== undefined ? nodeOutputs[wireA.fromNodeId] : 0;
          const valB = wireB && nodeOutputs[wireB.fromNodeId] !== undefined ? nodeOutputs[wireB.fromNodeId] : 0;

          if (isOutputSink(node.type)) {
            nodeOutputs[node.id] = valA;
          } else {
            nodeOutputs[node.id] = evaluateGate(node.type as GateType, valA, valB);
          }
        });
      }

      // 3. Update wire signals & node output values
      const updatedWires = currentWires.map((w) => ({
        ...w,
        signal: nodeOutputs[w.fromNodeId] ?? 0,
      }));

      const updatedNodes = currentNodes.map((n) => ({
        ...n,
        outputValue: nodeOutputs[n.id] ?? 0,
        state: isOutputSink(n.type) ? nodeOutputs[n.id] ?? 0 : n.state,
      }));

      return { updatedNodes, updatedWires };
    },
    []
  );

  // Re-evaluate on any state change
  useEffect(() => {
    const { updatedNodes, updatedWires } = simulateCircuit(nodes, connections);

    // Only update if changes occurred to prevent re-render loop
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(updatedNodes);
    const wiresChanged = JSON.stringify(connections) !== JSON.stringify(updatedWires);

    if (nodesChanged) setNodes(updatedNodes);
    if (wiresChanged) setConnections(updatedWires);
  }, [connections.length, nodes.map((n) => `${n.id}_${n.state}`).join(',')]);

  // Add a new component to canvas
  const addComponent = (type: ComponentType, labelPrefix?: string) => {
    const id = `node_${uuidv4().substring(0, 8)}`;
    const defaultLabel = labelPrefix || type;
    const initialPosition = {
      x: 180 + Math.floor(Math.random() * 200),
      y: 100 + Math.floor(Math.random() * 200),
    };

    const newNode: CircuitNode = {
      id,
      type,
      x: initialPosition.x,
      y: initialPosition.y,
      label: defaultLabel,
      state: type === 'SWITCH' ? 0 : undefined,
      outputValue: 0,
    };

    setNodes((prev) => [...prev, newNode]);
    recordCircuitBuilt();
    playSound('click', soundEnabled);
  };

  // Toggle switch on / off
  const handleToggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId && n.type === 'SWITCH') {
          const next = n.state === 1 ? 0 : 1;
          playSound('click', soundEnabled);
          return { ...n, state: next };
        }
        return n;
      })
    );
  };

  // Canvas Drag & Drop handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (draggingNodeId) {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === draggingNodeId) {
            const nextX = Math.max(10, Math.min(rect.width - 120, currentX - dragOffset.x));
            const nextY = Math.max(10, Math.min(rect.height - 80, currentY - dragOffset.y));
            return { ...n, x: nextX, y: nextY };
          }
          return n;
        })
      );
    }

    if (wireStart) {
      setMousePos({ x: currentX, y: currentY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Wire Connection Handlers
  const handlePinClick = (nodeId: string, isOutput: boolean, pinIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutput) {
      // Start dragging a new wire from output pin
      setWireStart({ nodeId, pinIndex });
      playSound('click', soundEnabled);
    } else {
      // Target input pin clicked
      if (wireStart) {
        if (wireStart.nodeId === nodeId) {
          // Cannot connect node to itself
          setWireStart(null);
          return;
        }

        // Remove any prior connection to this exact target pin
        const filtered = connections.filter(
          (c) => !(c.toNodeId === nodeId && c.toPinIndex === pinIndex)
        );

        const newWire: WireConnection = {
          id: `wire_${uuidv4().substring(0, 8)}`,
          fromNodeId: wireStart.nodeId,
          fromPinIndex: wireStart.pinIndex,
          toNodeId: nodeId,
          toPinIndex: pinIndex,
          signal: 0,
        };

        setConnections([...filtered, newWire]);
        setWireStart(null);
        playSound('toggle', soundEnabled);
      }
    }
  };

  // Delete a specific node
  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    );
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    playSound('click', soundEnabled);
  };

  // Delete a specific wire
  const deleteWire = (wireId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== wireId));
    playSound('click', soundEnabled);
  };

  // Load a preset circuit
  const loadPreset = (index: number) => {
    const preset = presetCircuits[index];
    if (!preset) return;
    setNodes(JSON.parse(JSON.stringify(preset.nodes)));
    setConnections(JSON.parse(JSON.stringify(preset.connections)));
    setShowPresetModal(false);
    playSound('levelup', soundEnabled);
  };

  // Clear canvas
  const clearCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setWireStart(null);
  };

  // Helper Coordinates for Pins
  const getNodeOutputCoords = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + 100,
      y: node.y + 40,
    };
  };

  const getNodeInputCoords = (nodeId: string, pinIndex: number) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const isSingle = isSingleInputNode(node.type);
    if (isSingle) {
      return { x: node.x, y: node.y + 40 };
    }
    return {
      x: node.x,
      y: pinIndex === 0 ? node.y + 25 : node.y + 55,
    };
  };

  // Auto truth table generation for current circuit
  const generateTruthTable = () => {
    const switchNodes = nodes.filter((n) => n.type === 'SWITCH');
    const outputNodes = nodes.filter((n) => isOutputSink(n.type));

    if (switchNodes.length === 0 || outputNodes.length === 0) {
      return null;
    }

    const totalRows = Math.pow(2, switchNodes.length);
    const table: Array<{ inputs: Record<string, number>; outputs: Record<string, number> }> = [];

    for (let r = 0; r < totalRows; r++) {
      const inputCombo: Record<string, number> = {};
      switchNodes.forEach((s, idx) => {
        // compute bit value
        const bit = (r >> (switchNodes.length - 1 - idx)) & 1;
        inputCombo[s.id] = bit;
      });

      // Clone nodes and assign this state
      const testNodes = nodes.map((n) => {
        if (inputCombo[n.id] !== undefined) {
          return { ...n, state: inputCombo[n.id] };
        }
        return { ...n };
      });

      const simResult = simulateCircuit(testNodes, connections);
      const outputCombo: Record<string, number> = {};
      outputNodes.forEach((o) => {
        const found = simResult.updatedNodes.find((n) => n.id === o.id);
        outputCombo[o.id] = found?.outputValue ?? 0;
      });

      table.push({ inputs: inputCombo, outputs: outputCombo });
    }

    return { switchNodes, outputNodes, table };
  };

  const truthTableData = showTruthTableModal ? generateTruthTable() : null;

  // Component palette configuration
  const componentCategories: Array<{
    category: string;
    items: Array<{ type: ComponentType; label: string }>;
  }> = [
    {
      category: isEl ? 'Είσοδοι & Σήματα' : 'Inputs & Signals',
      items: [
        { type: 'SWITCH', label: isEl ? 'Διακόπτης' : 'Switch' },
        { type: 'CLOCK', label: isEl ? 'Ρολόι (Clock)' : 'Clock Gen' },
        { type: 'CONST_1', label: 'HIGH (1)' },
        { type: 'CONST_0', label: 'LOW (0)' },
      ],
    },
    {
      category: isEl ? 'Βασικές Πύλες' : 'Standard Gates',
      items: [
        { type: 'AND', label: 'AND' },
        { type: 'OR', label: 'OR' },
        { type: 'NOT', label: 'NOT' },
        { type: 'XOR', label: 'XOR' },
      ],
    },
    {
      category: isEl ? 'Σύνθετες Πύλες' : 'Universal & Other',
      items: [
        { type: 'NAND', label: 'NAND' },
        { type: 'NOR', label: 'NOR' },
        { type: 'XNOR', label: 'XNOR' },
        { type: 'BUFFER', label: 'Buffer' },
      ],
    },
    {
      category: isEl ? 'Έξοδοι & Ενδείξεις' : 'Outputs & Displays',
      items: [
        { type: 'LED', label: 'LED Bulb' },
        { type: 'PROBE', label: isEl ? 'Ακροδέκτης' : 'Probe' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-600/30">
            ⚡
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEl ? 'Σχεδιαστής Κυκλωμάτων' : 'Circuit Designer'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEl
                ? 'Σχεδίασε, ένωσε πύλες και δοκίμασε σε πραγματικό χρόνο'
                : 'Build, wire gates and simulate in real time'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPresetModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            {isEl ? 'Έτοιμα Κυκλώματα' : 'Presets'}
          </button>

          <button
            onClick={() => setShowTruthTableModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800 transition-all shadow-sm"
          >
            <Table className="w-4 h-4" />
            {isEl ? 'Πίνακας Αληθείας' : 'Truth Table'}
          </button>

          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all"
            title={isEl ? 'Καθαρισμός καμβά' : 'Clear canvas'}
          >
            <Trash2 className="w-4 h-4" />
            {isEl ? 'Καθαρισμός' : 'Clear'}
          </button>

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
            title={isEl ? 'Οδηγίες χρήσης' : 'Instructions'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Component Palette */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {isEl ? 'Βιβλιοθήκη Στοιχείων' : 'Component Palette'}
            </h3>

            {componentCategories.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {cat.category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addComponent(item.type)}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex flex-col items-center gap-1.5 shadow-sm active:scale-95 group"
                    >
                      <div className="scale-75 group-hover:scale-90 transition-transform">
                        <GateSvg type={item.type} width={45} height={30} active={false} />
                      </div>
                      <span className="truncate w-full text-center">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right Canvas Workspace */}
        <div className="lg:col-span-9">
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full h-[620px] bg-slate-900 dark:bg-slate-950 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-inner overflow-hidden select-none cursor-crosshair"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* SVG Layer for Wires */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Render Existing Connections */}
              {connections.map((wire) => {
                const from = getNodeOutputCoords(wire.fromNodeId);
                const to = getNodeInputCoords(wire.toNodeId, wire.toPinIndex);
                const isSignalHigh = wire.signal === 1;

                // Curved bezier wire path
                const dx = Math.abs(to.x - from.x) * 0.5;
                const pathData = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;

                return (
                  <g key={wire.id} className="cursor-pointer group pointer-events-auto">
                    {/* Wider transparent hit area */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                      onClick={() => deleteWire(wire.id)}
                    />
                    {/* Visual glowing wire */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isSignalHigh ? '#22c55e' : '#64748b'}
                      strokeWidth={isSignalHigh ? '3.5' : '2.5'}
                      strokeLinecap="round"
                      filter={isSignalHigh ? 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.8))' : 'none'}
                    />
                  </g>
                );
              })}

              {/* In-progress wiring line */}
              {wireStart && (
                <path
                  d={`M ${getNodeOutputCoords(wireStart.nodeId).x} ${
                    getNodeOutputCoords(wireStart.nodeId).y
                  } L ${mousePos.x} ${mousePos.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                />
              )}
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isSource = isInputSource(node.type);
              const isSink = isOutputSink(node.type);
              const isSingleInput = isSingleInputNode(node.type);
              const isNodeHigh = node.outputValue === 1 || node.state === 1;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                  }}
                  className={`absolute z-10 w-[100px] p-2 rounded-2xl bg-slate-800/95 dark:bg-slate-900/95 border-2 transition-shadow backdrop-blur-sm cursor-grab active:cursor-grabbing text-slate-100 ${
                    isSelected
                      ? 'border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                      : isNodeHigh
                      ? 'border-emerald-500/80 shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                      : 'border-slate-600 dark:border-slate-700'
                  }`}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs font-black shadow-md z-20"
                    title={isEl ? 'Διαγραφή' : 'Delete'}
                  >
                    ×
                  </button>

                  {/* Node Label / Interactive Switch */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-300 truncate max-w-[55px]">
                      {node.label}
                    </span>
                    {node.type === 'SWITCH' && (
                      <button
                        onClick={(e) => handleToggleNode(node.id, e)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          node.state === 1
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {node.state === 1 ? '1 ON' : '0 OFF'}
                      </button>
                    )}
                  </div>

                  {/* Component Diagram / Display */}
                  <div className="flex items-center justify-center my-1">
                    <GateSvg
                      type={node.type}
                      width={65}
                      height={40}
                      active={isNodeHigh}
                    />
                  </div>

                  {/* Input Pins (Left Side) */}
                  {!isSource && (
                    <div className="absolute -left-2.5 top-0 bottom-0 flex flex-col justify-around py-3">
                      {isSingleInput ? (
                        <div
                          onClick={(e) => handlePinClick(node.id, false, 0, e)}
                          className="w-4 h-4 rounded-full bg-indigo-500 hover:bg-indigo-300 border-2 border-slate-900 cursor-pointer shadow hover:scale-125 transition-transform"
                          title={isEl ? 'Είσοδος' : 'Input Pin'}
                        />
                      ) : (
                        <>
                          <div
                            onClick={(e) => handlePinClick(node.id, false, 0, e)}
                            className="w-4 h-4 rounded-full bg-indigo-500 hover:bg-indigo-300 border-2 border-slate-900 cursor-pointer shadow hover:scale-125 transition-transform"
                            title={isEl ? 'Είσοδος A' : 'Input Pin A'}
                          />
                          <div
                            onClick={(e) => handlePinClick(node.id, false, 1, e)}
                            className="w-4 h-4 rounded-full bg-indigo-500 hover:bg-indigo-300 border-2 border-slate-900 cursor-pointer shadow hover:scale-125 transition-transform"
                            title={isEl ? 'Είσοδος B' : 'Input Pin B'}
                          />
                        </>
                      )}
                    </div>
                  )}

                  {/* Output Pin (Right Side) */}
                  {!isSink && (
                    <div className="absolute -right-2.5 top-1/2 -translate-y-1/2">
                      <div
                        onClick={(e) => handlePinClick(node.id, true, 0, e)}
                        className={`w-4 h-4 rounded-full border-2 border-slate-900 cursor-pointer shadow hover:scale-125 transition-transform ${
                          wireStart?.nodeId === node.id
                            ? 'bg-amber-400 ring-4 ring-amber-400/40 animate-ping'
                            : isNodeHigh
                            ? 'bg-emerald-400'
                            : 'bg-slate-400 hover:bg-emerald-400'
                        }`}
                        title={isEl ? 'Έξοδος (Κάντε κλικ για σύνδεση καλωδίου)' : 'Output Pin (Click to wire)'}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Instruction Overlay when Canvas is Empty */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 pointer-events-none p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/80 dark:bg-slate-900/80 flex items-center justify-center text-3xl">
                  ⚡
                </div>
                <h3 className="font-bold text-lg text-slate-300 dark:text-slate-400">
                  {isEl ? 'Ο καμβάς είναι άδειος' : 'Canvas is Empty'}
                </h3>
                <p className="text-xs max-w-sm text-slate-400 dark:text-slate-500 leading-relaxed">
                  {isEl
                    ? 'Επιλέξτε πύλες και διακόπτες από την αριστερή βιβλιοθήκη ή φορτώστε ένα έτοιμο κύκλωμα!'
                    : 'Add gates and switches from the left palette or load a preset circuit!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Circuits Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-500" />
                {isEl ? 'Έτοιμα Κυκλώματα Προς Εξερεύνηση' : 'Preset Demo Circuits'}
              </h3>
              <button
                onClick={() => setShowPresetModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {presetCircuits.map((preset, pIdx) => (
                <div
                  key={pIdx}
                  onClick={() => loadPreset(pIdx)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/60 cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isEl ? preset.nameEl : preset.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isEl ? preset.descriptionEl : preset.description}
                  </p>
                  <span className="inline-block mt-3 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {isEl ? 'Φόρτωση Κυκλώματος →' : 'Load Circuit →'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auto Truth Table Generator Modal */}
      {showTruthTableModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-purple-500" />
                {isEl ? 'Αυτόματος Πίνακας Αληθείας Κυκλώματος' : 'Circuit Truth Table Generator'}
              </h3>
              <button
                onClick={() => setShowTruthTableModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {truthTableData ? (
              <div className="overflow-x-auto max-h-[50vh] rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-center text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {truthTableData.switchNodes.map((s) => (
                        <th key={s.id} className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">
                          {s.label}
                        </th>
                      ))}
                      {truthTableData.outputNodes.map((o) => (
                        <th key={o.id} className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                          {o.label || 'Έξοδος'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-750 font-mono">
                    {truthTableData.table.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                        {truthTableData.switchNodes.map((s) => (
                          <td key={s.id} className="py-2 px-3 text-slate-800 dark:text-slate-200 font-bold">
                            {row.inputs[s.id]}
                          </td>
                        ))}
                        {truthTableData.outputNodes.map((o) => {
                          const val = row.outputs[o.id];
                          return (
                            <td
                              key={o.id}
                              className={`py-2 px-3 font-bold ${
                                val === 1
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm">
                  {isEl
                    ? 'Για να παραχθεί πίνακας αληθείας, το κύκλωμα χρειάζεται τουλάχιστον 1 Διακόπτη (Switch) και 1 Έξοδο (LED / Probe).'
                    : 'To generate a truth table, the circuit needs at least 1 Switch and 1 Output sink (LED / Probe).'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                {isEl ? 'Οδηγίες Χρήσης Σχεδιαστή' : 'How to Use the Designer'}
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-5">
              <li>
                <strong>{isEl ? 'Προσθήκη στοιχείων:' : 'Add components:'}</strong>{' '}
                {isEl
                  ? 'Κάντε κλικ σε οποιοδήποτε στοιχείο από την αριστερή παλέτα.'
                  : 'Click on any item in the left palette to spawn it on canvas.'}
              </li>
              <li>
                <strong>{isEl ? 'Σύνδεση καλωδίων:' : 'Connecting wires:'}</strong>{' '}
                {isEl
                  ? 'Κάντε κλικ στο δεξί κυκλάκι (έξοδος) μιας πύλης και μετά στο αριστερό κυκλάκι (είσοδος) μιας άλλης.'
                  : 'Click on a gate output pin (right), then click an input pin (left) of another gate.'}
              </li>
              <li>
                <strong>{isEl ? 'Διαγραφή:' : 'Deleting:'}</strong>{' '}
                {isEl
                  ? 'Πατήστε το κόκκινο "×" σε ένα στοιχείο ή κάντε κλικ σε ένα καλώδιο για να το αφαιρέσετε.'
                  : 'Click the red "×" button on a node or click directly on a wire to remove it.'}
              </li>
              <li>
                <strong>{isEl ? 'Διακόπτες:' : 'Switches:'}</strong>{' '}
                {isEl
                  ? 'Κάντε κλικ στο κουμπί 0/1 ενός διακόπτη για να αλλάξετε το λογικό σήμα (HIGH/LOW).'
                  : 'Click on the 0/1 button on any switch to toggle HIGH and LOW state.'}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
