# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

ARG USERNAME=root
RUN mkdir -p /home/$USERNAME/.vscode-server/extensions \
        /home/$USERNAME/.vscode-server-insiders/extensions

ARG NODE_MODULES="pnpm nrm vercel"
RUN umask 0002 && npm config set registry https://registry.npmmirror.com/ \
    && npm install -g $NODE_MODULES \
    && npm cache clean --force > /dev/null 2>&1