"use client";

import { useEffect, useState } from "react";

type DocumentSource = {
  id: string;
  title: string;
  sourceType: string;
  sourcePath: string | null;
  rawContent: string | null;
  contentCharCount: number;
  chunkCount: number;
  contentHash: string | null;
  ingestionStatus: string;
  ingestionError: string | null;
  ingestedAt: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
};

type DocumentsApiResponse = {
  available?: boolean;
  error?: string;
  documents?: DocumentSource[];
  document?: DocumentSource;
};

type ChunkSearchResult = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  charCount: number;
  score: number;
  createdAt: string;
};

type ChunkSearchApiResponse = {
  available?: boolean;
  error?: string;
  query?: string;
  results?: ChunkSearchResult[];
};

const SOURCE_TYPE_OPTIONS = [
  { label: "Manual", value: "manual" },
  { label: "URL", value: "url" },
  { label: "Arquivo local", value: "file_reference" },
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getNotes(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const notes = (metadata as { notes?: unknown }).notes;

  return typeof notes === "string" && notes.trim() ? notes : null;
}

export default function WorkspaceDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentSource[]>([]);
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState("manual");
  const [sourcePath, setSourcePath] = useState("");
  const [notes, setNotes] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChunkSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [removingDocumentId, setRemovingDocumentId] = useState<string | null>(
    null,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadDocuments() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/documents", { cache: "no-store" });
      const payload = (await response.json()) as DocumentsApiResponse;

      if (!response.ok || !payload.available || !payload.documents) {
        setDocuments([]);
        setErrorMessage(payload.error ?? "Fontes indisponiveis.");
        return;
      }

      setDocuments(payload.documents);
    } catch {
      setDocuments([]);
      setErrorMessage("Nao foi possivel carregar as fontes.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDocuments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          sourceType,
          sourcePath,
          notes,
          rawContent,
        }),
      });
      const payload = (await response.json()) as DocumentsApiResponse;

      if (!response.ok || !payload.available || !payload.document) {
        setErrorMessage(payload.error ?? "Nao foi possivel salvar a fonte.");
        return;
      }

      setDocuments((currentDocuments) => [
        payload.document as DocumentSource,
        ...currentDocuments,
      ]);
      setTitle("");
      setSourcePath("");
      setNotes("");
      setRawContent("");
      setSourceType("manual");
      setStatusMessage("Fonte cadastrada.");
    } catch {
      setErrorMessage("Nao foi possivel salvar a fonte.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemoveDocument(documentId: string) {
    setRemovingDocumentId(documentId);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/documents?id=${encodeURIComponent(documentId)}`,
        { method: "DELETE" },
      );
      const payload = (await response.json()) as DocumentsApiResponse;

      if (!response.ok || !payload.available) {
        setErrorMessage(payload.error ?? "Nao foi possivel remover a fonte.");
        return;
      }

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== documentId),
      );
      setStatusMessage("Fonte removida.");
    } catch {
      setErrorMessage("Nao foi possivel remover a fonte.");
    } finally {
      setRemovingDocumentId(null);
    }
  }

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setSearchResults([]);
      setSearchMessage("Digite um termo para buscar.");
      return;
    }

    setIsSearching(true);
    setSearchMessage(null);

    try {
      const response = await fetch(
        `/api/documents/search?q=${encodeURIComponent(normalizedQuery)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as ChunkSearchApiResponse;

      if (!response.ok || !payload.available || !payload.results) {
        setSearchResults([]);
        setSearchMessage(payload.error ?? "Busca indisponivel.");
        return;
      }

      setSearchResults(payload.results);
      setSearchMessage(
        payload.results.length > 0
          ? `${payload.results.length} resultado(s) encontrado(s).`
          : "Nenhum chunk encontrado.",
      );
    } catch {
      setSearchResults([]);
      setSearchMessage("Busca indisponivel.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Fontes
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          Base de documentos
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
          Cadastre materiais de estudo, links e referências locais para preparar
          a futura base de conhecimento.
        </p>
      </div>

      <form
        className="grid gap-4 border border-zinc-200 p-5 dark:border-zinc-800"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Título
            <input
              className="border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
              maxLength={120}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Guia de SQL para analytics"
              required
              value={title}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Tipo
            <select
              className="border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
              onChange={(event) => setSourceType(event.target.value)}
              value={sourceType}
            >
              {SOURCE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Referência
          <input
            className="border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
            maxLength={500}
            onChange={(event) => setSourcePath(event.target.value)}
            placeholder="URL, caminho local ou identificação do material"
            value={sourcePath}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Notas
          <textarea
            className="min-h-28 resize-y border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
            maxLength={2000}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Resumo, prioridade ou motivo para estudar esta fonte"
            value={notes}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Conteúdo bruto
          <textarea
            className="min-h-44 resize-y border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
            maxLength={20000}
            onChange={(event) => setRawContent(event.target.value)}
            placeholder="Cole aqui o texto da fonte para deixar pronto para a próxima etapa de chunks e embeddings"
            value={rawContent}
          />
          <span className="text-xs font-normal text-zinc-500">
            {rawContent.trim().length} caracteres de conteúdo
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="border border-zinc-950 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-950"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Salvando..." : "Cadastrar fonte"}
          </button>

          {statusMessage ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {statusMessage}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="text-sm text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </form>

      <section className="border border-zinc-200 p-5 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
            Buscar nos chunks
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Encontre trechos já segmentados antes de ligar embeddings ou RAG.
          </p>
        </div>

        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
          <input
            className="min-w-0 flex-1 border border-zinc-300 bg-transparent px-3 py-2 text-base text-zinc-950 outline-none transition-colors focus:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50"
            maxLength={120}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Ex.: window functions"
            value={searchQuery}
          />
          <button
            className="border border-zinc-950 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-950"
            disabled={isSearching}
            type="submit"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {searchMessage ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {searchMessage}
          </p>
        ) : null}

        {searchResults.length > 0 ? (
          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {searchResults.map((result) => (
              <article className="py-4" key={result.chunkId}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {result.documentTitle}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    chunk {result.chunkIndex + 1} · score {result.score} ·{" "}
                    {result.charCount} caracteres
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  {result.content}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
            Fontes cadastradas
          </h3>
          <span className="text-sm text-zinc-500">
            {documents.length} {documents.length === 1 ? "fonte" : "fontes"}
          </span>
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Carregando fontes...
          </p>
        ) : documents.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Nenhuma fonte cadastrada ainda.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {documents.map((document) => {
              const documentNotes = getNotes(document.metadata);

              return (
                <article className="py-5" key={document.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-zinc-950 dark:text-zinc-50">
                        {document.title}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-500">
                        {document.sourceType} · {document.ingestionStatus} ·{" "}
                        {document.contentCharCount} caracteres ·{" "}
                        {document.chunkCount} chunks ·{" "}
                        {formatDate(document.createdAt)}
                      </p>
                    </div>
                    <button
                      className="border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-400 dark:hover:text-red-400"
                      disabled={removingDocumentId === document.id}
                      onClick={() => void handleRemoveDocument(document.id)}
                      type="button"
                    >
                      {removingDocumentId === document.id
                        ? "Removendo..."
                        : "Remover"}
                    </button>
                  </div>

                  {document.sourcePath ? (
                    <p className="mt-3 break-words text-sm text-zinc-700 dark:text-zinc-300">
                      {document.sourcePath}
                    </p>
                  ) : null}

                  {documentNotes ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                      {documentNotes}
                    </p>
                  ) : null}

                  {document.rawContent ? (
                    <details className="mt-3 border border-zinc-200 p-3 dark:border-zinc-800">
                      <summary className="cursor-pointer text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        Ver conteúdo bruto
                      </summary>
                      <p className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {document.rawContent}
                      </p>
                    </details>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
