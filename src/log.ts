import { languages, editor } from "monaco-editor";
// Register a new language
languages.register({ id: "mySpecialLanguage" });

// Register a tokens provider for the language
languages.setMonarchTokensProvider("mySpecialLanguage", {
  tokenizer: {
    root: [
      ["Received Raw:", "starter"],
      [/-[0-9]+/, "low-pulse"],
      [/[0-9]+/, "high-pulse"],
      [/\[\d\d:\d\d:\d\d\]/, "time"],
      [/\[\w\]/, "message-type"],
      [/\[.*\]/, "meta"],
    ],
  },
});

// Define a new theme that contains only rules that match this language
editor.defineTheme("myCoolTheme", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "low-pulse", foreground: "#9CDCFE" },
    { token: "high-pulse", foreground: "#B5CEA8" },
    { token: "custom-date", foreground: "008800" },
    { token: "time", foreground: "#4EC9B0" },
    { token: "message-type", foreground: "#DCDCAA" },
    { token: "meta", foreground: "#6A9955" },
    { token: "starter", foreground: "#D16969", fontStyle: "bold" },
  ],
  colors: {
    // "editor.foreground": "#000000",
  },
});

// Register a completion item provider for the new language
languages.registerCompletionItemProvider("mySpecialLanguage", {
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
