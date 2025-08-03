# Etapa base (python 3.11 slim)
FROM --platform=$BUILDPLATFORM python:3.11-slim AS base

# Etapa de build para multi-arquitetura (faz nada neste caso, mas é útil para compatibilidade)
FROM base AS build

# Etapa final (runtime)
FROM base AS final

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências
RUN pip install --no-cache-dir flask

# Expõe a porta padrão do Flask
EXPOSE 5000

# Comando padrão para iniciar o app
CMD ["python", "app.py"]
