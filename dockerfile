FROM alpine:3.20

# Install necessary packages and clean up
RUN apk update \
    && apk add nodejs \
    && apk add npm \
    && npm install -g @google/clasp

# Set up the entrypoint to use clasp
ENTRYPOINT ["clasp login --no-localhost"]

# Expose any ports if necessary (for development)
EXPOSE 3000

# Command to run when the container starts
CMD ["sh"]