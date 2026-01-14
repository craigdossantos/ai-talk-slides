/**
 * Tests for Project Setup User Stories (US-001 to US-003)
 *
 * These tests verify the initial project configuration and setup
 * for the react-flow-app presentation application.
 */

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Project root path for file system checks
const PROJECT_ROOT = path.resolve(__dirname, "../..");

describe("US-001 - Initialize Vite + React + TypeScript project", () => {
  describe("vite.config.ts", () => {
    it("should exist in project root", () => {
      const configPath = path.join(PROJECT_ROOT, "vite.config.ts");
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it("should have proper Vite configuration", async () => {
      const configContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "vite.config.ts"),
        "utf-8",
      );

      // Check for essential Vite config elements
      expect(configContent).toContain("defineConfig");
      expect(configContent).toContain("plugins");
      expect(configContent).toContain("react");
    });

    it("should configure the react plugin", async () => {
      const configContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "vite.config.ts"),
        "utf-8",
      );

      expect(configContent).toContain("@vitejs/plugin-react");
      expect(configContent).toContain("react()");
    });
  });

  describe("TypeScript configuration", () => {
    it("should have tsconfig.json in project root", () => {
      const tsconfigPath = path.join(PROJECT_ROOT, "tsconfig.json");
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    it("should have tsconfig.app.json in project root", () => {
      const tsconfigAppPath = path.join(PROJECT_ROOT, "tsconfig.app.json");
      expect(fs.existsSync(tsconfigAppPath)).toBe(true);
    });

    it("should have proper TypeScript configuration for React", () => {
      const tsconfigAppContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "tsconfig.app.json"),
        "utf-8",
      );

      // tsconfig.app.json may contain comments (JSONC format)
      // so we check for essential config with string matching
      expect(tsconfigAppContent).toMatch(/"jsx":\s*"react-jsx"/);
      expect(tsconfigAppContent).toMatch(/"strict":\s*true/);
    });
  });

  describe("package.json dependencies", () => {
    let packageJson: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };

    beforeAll(() => {
      const packageJsonContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "package.json"),
        "utf-8",
      );
      packageJson = JSON.parse(packageJsonContent);
    });

    it("should have @xyflow/react as a dependency", () => {
      expect(packageJson.dependencies["@xyflow/react"]).toBeDefined();
    });

    it("should have react as a dependency", () => {
      expect(packageJson.dependencies["react"]).toBeDefined();
    });

    it("should have react-dom as a dependency", () => {
      expect(packageJson.dependencies["react-dom"]).toBeDefined();
    });

    it("should have react-remark as a dependency", () => {
      expect(packageJson.dependencies["react-remark"]).toBeDefined();
    });
  });

  describe("base CSS font imports", () => {
    let indexCssContent: string;

    beforeAll(() => {
      indexCssContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/index.css"),
        "utf-8",
      );
    });

    it("should import Space Grotesk font", () => {
      expect(indexCssContent).toContain("Space+Grotesk");
    });

    it("should import Inter font", () => {
      expect(indexCssContent).toContain("Inter");
    });

    it("should import JetBrains Mono font", () => {
      expect(indexCssContent).toContain("JetBrains+Mono");
    });

    it("should use Google Fonts for font imports", () => {
      expect(indexCssContent).toContain("fonts.googleapis.com");
    });
  });
});

describe("US-002 - Install and configure @xyflow/react", () => {
  describe("@xyflow/react installation", () => {
    it("should be importable", async () => {
      // Verify the package can be imported
      const xyflow = await import("@xyflow/react");
      expect(xyflow).toBeDefined();
      expect(xyflow.ReactFlow).toBeDefined();
      expect(xyflow.ReactFlowProvider).toBeDefined();
    });
  });

  describe("react-remark installation", () => {
    it("should be importable", async () => {
      const reactRemark = await import("react-remark");
      expect(reactRemark).toBeDefined();
    });
  });

  describe("App.tsx configuration", () => {
    let appTsxContent: string;

    beforeAll(() => {
      appTsxContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/App.tsx"),
        "utf-8",
      );
    });

    it("should import ReactFlowProvider", () => {
      expect(appTsxContent).toContain("ReactFlowProvider");
      expect(appTsxContent).toContain('@xyflow/react"');
    });

    it("should wrap app content with ReactFlowProvider", () => {
      expect(appTsxContent).toContain("<ReactFlowProvider>");
      expect(appTsxContent).toContain("</ReactFlowProvider>");
    });

    it("should import @xyflow/react styles", () => {
      expect(appTsxContent).toContain("@xyflow/react/dist/style.css");
    });
  });

  describe("CSS dark background color", () => {
    it("should define dark background color #0f172a in CSS variables", () => {
      const indexCssContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/index.css"),
        "utf-8",
      );

      // The dark background color is used for text-primary in the light theme
      // This verifies the slate-900 (#0f172a) color is defined
      expect(indexCssContent).toContain("#0f172a");
    });
  });
});

describe("US-003 - Create TypeScript type definitions", () => {
  describe("presentation.ts file", () => {
    it("should exist at src/types/presentation.ts", () => {
      const typesPath = path.join(PROJECT_ROOT, "src/types/presentation.ts");
      expect(fs.existsSync(typesPath)).toBe(true);
    });
  });

  describe("Section type", () => {
    it("should be importable", async () => {
      const types = await import("../types/presentation");
      // TypeScript interfaces don't exist at runtime, so we check the module exports
      expect(types).toBeDefined();
    });

    it("should have correct structure with id, title, track fields", () => {
      const typesContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/types/presentation.ts"),
        "utf-8",
      );

      // Check Section interface definition
      expect(typesContent).toContain("interface Section");
      expect(typesContent).toMatch(/Section[^}]*id:\s*string/);
      expect(typesContent).toMatch(/Section[^}]*title:\s*string/);
      expect(typesContent).toMatch(/Section[^}]*track:\s*Track/);
    });
  });

  describe("SlideContent type", () => {
    it("should have correct structure", () => {
      const typesContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/types/presentation.ts"),
        "utf-8",
      );

      // Check SlideContent interface definition
      expect(typesContent).toContain("interface SlideContent");
      expect(typesContent).toMatch(/SlideContent[^}]*id:\s*string/);
      expect(typesContent).toMatch(/SlideContent[^}]*sectionId:\s*string/);
      expect(typesContent).toMatch(/SlideContent[^}]*type:\s*SlideType/);
      expect(typesContent).toMatch(/SlideContent[^}]*title:\s*string/);
      expect(typesContent).toMatch(/SlideContent[^}]*subtitle\?:\s*string/);
      expect(typesContent).toMatch(/SlideContent[^}]*bullets\?:\s*string\[\]/);
      expect(typesContent).toMatch(/SlideContent[^}]*quote\?:\s*string/);
    });
  });

  describe("Resource type", () => {
    it("should have correct structure with id, slideId, type, title, url fields", () => {
      const typesContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/types/presentation.ts"),
        "utf-8",
      );

      // Check Resource interface definition
      expect(typesContent).toContain("interface Resource");
      expect(typesContent).toMatch(/Resource[^}]*id:\s*string/);
      expect(typesContent).toMatch(/Resource[^}]*slideId:\s*string/);
      expect(typesContent).toMatch(/Resource[^}]*type:\s*ResourceType/);
      expect(typesContent).toMatch(/Resource[^}]*title:\s*string/);
      expect(typesContent).toMatch(/Resource[^}]*url:\s*string/);
    });
  });

  describe("Node data interfaces", () => {
    let typesContent: string;

    beforeAll(() => {
      typesContent = fs.readFileSync(
        path.join(PROJECT_ROOT, "src/types/presentation.ts"),
        "utf-8",
      );
    });

    it("should define SlideNodeData interface", () => {
      expect(typesContent).toContain("interface SlideNodeData");
      expect(typesContent).toMatch(/SlideNodeData[^}]*slide:\s*SlideContent/);
      expect(typesContent).toMatch(/SlideNodeData[^}]*section:\s*Section/);
    });

    it("should define SectionHeaderNodeData interface", () => {
      expect(typesContent).toContain("interface SectionHeaderNodeData");
      expect(typesContent).toMatch(
        /SectionHeaderNodeData[^}]*section:\s*Section/,
      );
    });

    it("should define ResourceNodeData interface", () => {
      expect(typesContent).toContain("interface ResourceNodeData");
      expect(typesContent).toMatch(/ResourceNodeData[^}]*resource:\s*Resource/);
    });

    it("should export node dimension constants", () => {
      expect(typesContent).toContain("NODE_DIMENSIONS");
      expect(typesContent).toContain("slide:");
      expect(typesContent).toContain("sectionHeader:");
      expect(typesContent).toContain("resource:");
    });

    it("should export track color constants", () => {
      expect(typesContent).toContain("TRACK_COLORS");
      expect(typesContent).toContain("non-technical");
      expect(typesContent).toContain("technical");
    });
  });
});
