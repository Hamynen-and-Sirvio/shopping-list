CREATE TABLE entries (
    id INTEGER PRIMARY KEY,
    position INTEGER NOT NULL CHECK (position >= 1),
    content TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT 0 CHECK (checked IN (0, 1))
);
