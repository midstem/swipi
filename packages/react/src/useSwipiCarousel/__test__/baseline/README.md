# Golden baseline

Recordings of the exact `onChange` / `onSelect` sequences the React implementation
produced before the core extraction, captured for issue #220. Both callbacks share a
single log, so the order between them is recorded as well as the payloads.

The expected sequences are frozen literals rather than snapshots on purpose: `vitest -u`
must not be able to rewrite the baseline. A failure here means the behaviour moved — fix
the code, or change the recording deliberately and say so in the pull request.

This suite is scaffolding for the migration, not part of the permanent test surface.
It can be deleted once `createSwipi` owns the behaviour and carries equivalent coverage
of its own, which is why it lives in a folder of its own.
