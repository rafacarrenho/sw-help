# Rune image assets

Source: [SWARFARM](https://github.com/swarfarm/swarfarm), commit
`d68ee42efa554238b6f38471e3a9e7b33031bf62`, directory
`herders/static/herders/images/runes/`.

The rune images and other Summoners War game artwork belong to Com2uS. They are
stored locally so the static PlayerDojo tools do not depend on a third-party
image server at runtime.

The files in `gold/` are static color-normalized variants of the original set
symbols. Their gold fill is baked into each PNG while the original outline and
transparency are preserved, so the interface does not recolor them with CSS.
Run `pnpm assets:runes` to regenerate these variants from the source files.
