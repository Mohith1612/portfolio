---
projectId: wal-engine
eyebrow: Storage systems
---

A write-ahead log is only useful when it preserves an unambiguous history through partial writes, corruption, process crashes, and concurrent callers. The project treats recovery behavior—not the append API—as the core product.
