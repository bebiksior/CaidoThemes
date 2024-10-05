import { CaidoBackendSDK } from "@/types";
import { Database } from "sqlite";
import { Theme } from "shared";

interface DatabaseTheme {
  id: string;
  name: string;
  description: string;
  author: string;
  primary_dark: string;
  primary_light: string;
  primary_subtle: string;
  button_primary_bg: string;
  button_primary_text: string;
  button_secondary_bg: string;
  button_secondary_text: string;
  button_tertiary_bg: string;
  button_tertiary_text: string;
}

class DatabaseManager {
  private sdk: CaidoBackendSDK;
  private database: Database | null = null;

  constructor(sdk: CaidoBackendSDK) {
    this.sdk = sdk;
  }

  async init(): Promise<boolean> {
    this.database = await this.sdk.meta.db();
    return await this.setupDatabase();
  }

  private async setupDatabase(): Promise<boolean> {
    if (!this.database) return false;

    const tableExistsStatement = await this.database.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='themes'"
    );
    const tableExists = await tableExistsStatement.get();

    if (tableExists) {
      return false;
    }

    await this.database.exec(`
      CREATE TABLE themes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        author TEXT,
        primary_dark TEXT,
        primary_light TEXT,
        primary_subtle TEXT,
        button_primary_bg TEXT,
        button_primary_text TEXT,
        button_secondary_bg TEXT,
        button_secondary_text TEXT,
        button_tertiary_bg TEXT,
        button_tertiary_text TEXT
      )
    `);

    return true;
  }

  async createTheme(theme: Omit<Theme, "id">): Promise<string> {
    if (!this.database) throw new Error("Database not initialized");

    const startTime = Date.now();
    const id = Math.random().toString(36).slice(2, 15);

    const statement = await this.database.prepare(`
      INSERT INTO themes (
        id, name, description, author, 
        primary_dark, primary_light, primary_subtle,
        button_primary_bg, button_primary_text,
        button_secondary_bg, button_secondary_text,
        button_tertiary_bg, button_tertiary_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await statement.run(
      id,
      theme.name,
      theme.description,
      theme.author,
      theme.primary.dark,
      theme.primary.light,
      theme.primary.subtle,
      theme.button?.primary?.bg ?? null,
      theme.button?.primary?.text ?? null,
      theme.button?.secondary?.bg ?? null,
      theme.button?.secondary?.text ?? null,
      theme.button?.tertiary?.bg ?? null,
      theme.button?.tertiary?.text ?? null
    );

    const timeTaken = Date.now() - startTime;
    this.sdk.console.log(`[DATABASE] Created theme ID ${id} in ${timeTaken}ms`);

    return id;
  }

  async updateTheme(theme: Theme): Promise<void> {
    if (!this.database) throw new Error("Database not initialized");

    const startTime = Date.now();

    const statement = await this.database.prepare(`
      UPDATE themes SET
        name = ?, description = ?, author = ?,
        primary_dark = ?, primary_light = ?, primary_subtle = ?,
        button_primary_bg = ?, button_primary_text = ?,
        button_secondary_bg = ?, button_secondary_text = ?,
        button_tertiary_bg = ?, button_tertiary_text = ?
      WHERE id = ?
    `);

    await statement.run(
      theme.name,
      theme.description,
      theme.author,
      theme.primary.dark,
      theme.primary.light,
      theme.primary.subtle,
      theme.button?.primary?.bg ?? null,
      theme.button?.primary?.text ?? null,
      theme.button?.secondary?.bg ?? null,
      theme.button?.secondary?.text ?? null,
      theme.button?.tertiary?.bg ?? null,
      theme.button?.tertiary?.text ?? null,
      theme.id
    );

    const timeTaken = Date.now() - startTime;
    this.sdk.console.log(
      `[DATABASE] Updated theme ID ${theme.id} in ${timeTaken}ms`
    );
  }

  async deleteTheme(id: string): Promise<void> {
    if (!this.database) throw new Error("Database not initialized");

    const startTime = Date.now();
    const statement = await this.database.prepare(
      "DELETE FROM themes WHERE id = ?"
    );
    await statement.run(id);

    const timeTaken = Date.now() - startTime;
    this.sdk.console.log(`[DATABASE] Deleted theme ID ${id} in ${timeTaken}ms`);
  }

  async getThemes(): Promise<Theme[]> {
    if (!this.database) throw new Error("Database not initialized");

    const startTime = Date.now();

    const statement = await this.database.prepare("SELECT * FROM themes");
    const rows = (await statement.all()) as DatabaseTheme[];

    const timeTaken = Date.now() - startTime;
    this.sdk.console.log(`[DATABASE] Fetched themes in ${timeTaken}ms`);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      author: row.author,
      primary: {
        dark: row.primary_dark,
        light: row.primary_light,
        subtle: row.primary_subtle,
      },
      button: {
        primary: {
          bg: row.button_primary_bg,
          text: row.button_primary_text,
        },
        secondary: {
          bg: row.button_secondary_bg,
          text: row.button_secondary_text,
        },
        tertiary: {
          bg: row.button_tertiary_bg,
          text: row.button_tertiary_text,
        },
      },
    }));
  }

  async getTheme(id: string): Promise<Theme | null> {
    if (!this.database) throw new Error("Database not initialized");

    const statement = await this.database.prepare(
      "SELECT * FROM themes WHERE id = ?"
    );
    const row = (await statement.get(id)) as DatabaseTheme;

    return row
      ? {
          id: row.id,
          name: row.name,
          description: row.description,
          author: row.author,
          primary: {
            dark: row.primary_dark,
            light: row.primary_light,
            subtle: row.primary_subtle,
          },
          button: {
            primary: {
              bg: row.button_primary_bg,
              text: row.button_primary_text,
            },
            secondary: {
              bg: row.button_secondary_bg,
              text: row.button_secondary_text,
            },
            tertiary: {
              bg: row.button_tertiary_bg,
              text: row.button_tertiary_text,
            },
          },
        }
      : null;
  }

  async clearThemes(): Promise<void> {
    if (!this.database) throw new Error("Database not initialized");

    const statement = await this.database.prepare("DELETE FROM themes");
    await statement.run();
  }
}

export default DatabaseManager;
