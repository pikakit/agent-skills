# Media Processing Full Agent Rules

> Deterministic compilation of 1 source rules for media-processing v3.9.224. Do not edit directly.

## Rule Index

- [Media Transformation Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Media Transformation Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Media Transformation Gate

## Preconditions

- Probe the input and record streams, duration, dimensions, frame rate, color metadata, and file size.
- Confirm rights to process the media and validate explicit input and output paths.
- Detect installed tool versions, encoders, decoders, and delegates.

## Procedure

1. Translate output requirements into format, codec, dimensions, quality, metadata, and compatibility constraints.
2. Write to a new file in the intended directory; never overwrite the only source copy.
3. Pass arguments without shell interpolation and bound threads, duration, dimensions, and temporary storage for untrusted media.
4. Preserve orientation, color, audio, captions, and metadata only when required.
5. Capture the command, exit status, stderr, and tool version with sensitive paths redacted when necessary.
6. Probe the output and perform a representative visual or audible comparison.

## Rollback

Delete the incomplete output and temporary files. Preserve the original byte-for-byte. If an overwrite was explicitly authorized, restore from the verified backup.

## Exit Gate

Pass only when the tool exits successfully, the output is decodable, required streams and properties match, quality is accepted, and no unexpected source mutation occurred.
