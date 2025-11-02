CREATE TABLE entries (
    id INTEGER PRIMARY KEY,
    position INTEGER NOT NULL CHECK (position >= 1),
    content TEXT NOT NULL
);
