import { languages, editor } from "monaco-editor";
// Register a new language
export const LOGS_LANGUAGE = "ESPHomeRemoteReceiverLogsLanguage"
export const LOGS_THEME = "ESPHomeRemoteReceiverLogsTheme"
languages.register({ id: LOGS_LANGUAGE });

// Register a tokens provider for the language
languages.setMonarchTokensProvider(LOGS_LANGUAGE, {
  tokenizer: {
    root: [
      ["Received Raw:", "starter"],
      [/-[0-9]+/, "falling-flank"],
      [/[0-9]+/, "rising-flank"],
      [/\[\d\d:\d\d:\d\d\]/, "time"],
      [/\[\w\]/, "message-type"],
      [/\[.*\]/, "meta"],
      [/:/, "colon"],
      [/,/, "comma"],
    ],
  },
});

// Define a new theme that contains only rules that match this language
editor.defineTheme(LOGS_THEME, {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "falling-flank", foreground: "#9CDCFE" },
    { token: "rising-flank", foreground: "#B5CEA8" },
    { token: "custom-date", foreground: "008800" },
    { token: "time", foreground: "#215b4f"},//"#4EC9B0" },
    { token: "message-type", foreground: "#707055"},//"#DCDCAA" },
    { token: "meta", foreground: "#3f5a33"},//"#6A9955" },
    { token: "colon", foreground: "#716e6e"}, //"#d4d4d4"},
    { token: "comma", foreground: "#716e6e"}, //"#d4d4d4"},
    { token: "starter", foreground: "#D16969", fontStyle: "underline" },
  ],
  colors: {
    // "editor.foreground": "#000000",
  },
});


// Register a completion item provider for the new language
languages.registerCompletionItemProvider(LOGS_LANGUAGE, {
  provideCompletionItems: () => ({
    suggestions: [
      // {
      // 	label: 'simpleText',
      // 	kind: monaco.languages.CompletionItemKind.Text,
      // 	insertText: 'simpleText'
      // },
      // {
      // 	label: 'testing',
      // 	kind: monaco.languages.CompletionItemKind.Keyword,
      // 	insertText: 'testing(${1:condition})',
      // 	insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      // },
      // {
      // 	label: 'ifelse',
      // 	kind: monaco.languages.CompletionItemKind.Snippet,
      // 	insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
      // 	insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      // 	documentation: 'If-Else Statement'
      // }
    ],
  }),
});
