// AUTOGENERATED FILE
// This file was generated from grammar.ohm by `ohm generateBundles`.

import {
  BaseActionDict,
  Grammar,
  IterationNode,
  Node,
  NonterminalNode,
  Semantics,
  TerminalNode
} from 'ohm-js';

export interface ParserActionDict<T> extends BaseActionDict<T> {
  START?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
  CONSTANT?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  FUNCTION_CALL?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENTS_multiple_arguments?: (this: NonterminalNode, arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode) => T;
  ARGUMENTS_single_argument?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENTS?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENT_function?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENT_number?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENT_ref?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  ARGUMENT?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  REFERENCE_Range_reference?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: NonterminalNode) => T;
  REFERENCE_Single_reference?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  REFERENCE?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  MULTIFUNCTION_sum?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION_min?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION_mult?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION_max?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION_count?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION_avg?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  MULTIFUNCTION?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  SETFUNCTION_if?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode, arg5: NonterminalNode, arg6: TerminalNode) => T;
  SETFUNCTION_div?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  SETFUNCTION_mod?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  SETFUNCTION_minus?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  SETFUNCTION_sin?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_cos?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_tan?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_log?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  SETFUNCTION_power?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  SETFUNCTION_sqrt?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_abs?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_floor?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION_ceiling?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode) => T;
  SETFUNCTION?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  SINGLEARGUMENT?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  CONDITIONAL?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  LOGICFORMULA?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode, arg3: NonterminalNode, arg4: TerminalNode) => T;
  LOGICARG?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  NUMBER_fract?: (this: NonterminalNode, arg0: IterationNode, arg1: IterationNode, arg2: TerminalNode, arg3: IterationNode) => T;
  NUMBER_whole?: (this: NonterminalNode, arg0: IterationNode, arg1: IterationNode) => T;
  NUMBER_pi?: (this: NonterminalNode, arg0: IterationNode, arg1: TerminalNode) => T;
  NUMBER_euler?: (this: NonterminalNode, arg0: IterationNode, arg1: TerminalNode) => T;
  NUMBER?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  STRING?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode, arg2: TerminalNode) => T;
  BOOL?: (this: NonterminalNode, arg0: TerminalNode) => T;
  CellReference?: (this: NonterminalNode, arg0: NonterminalNode, arg1: NonterminalNode) => T;
  PartReference_row_ref?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode) => T;
  PartReference_col_ref?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode) => T;
  PartReference?: (this: NonterminalNode, arg0: NonterminalNode) => T;
}

export interface ParserSemantics extends Semantics {
  addOperation<T>(name: string, actionDict: ParserActionDict<T>): this;
  extendOperation<T>(name: string, actionDict: ParserActionDict<T>): this;
  addAttribute<T>(name: string, actionDict: ParserActionDict<T>): this;
  extendAttribute<T>(name: string, actionDict: ParserActionDict<T>): this;
}

export interface ParserGrammar extends Grammar {
  createSemantics(): ParserSemantics;
  extendSemantics(superSemantics: ParserSemantics): ParserSemantics;
}

declare const grammar: ParserGrammar;
export default grammar;

