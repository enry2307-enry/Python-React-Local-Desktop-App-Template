-- Write here your SQL


/* -- EXAMPLE SQL
CREATE TABLE "Category" (
    id INTEGER PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    type TEXT CHECK ( type IN ("expense", "income") )
);

CREATE TABLE "Account" (
    id INTEGER PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    balance INTEGER DEFAULT 0
);

CREATE TABLE "Transaction" (
    id INTEGER PRIMARY KEY,
    amount INTEGER NOT NULL,
    date TEXT NOT NULL DEFAULT (date('now')),
    category_id INTEGER REFERENCES "Category"(id),
    account_id INTEGER REFERENCES "Account"(id)
);

CREATE VIEW "Transaction_view" AS
SELECT
    t.amount AS "Amount",
    c.name AS "Category",
    a.name AS "Account",
    t.date AS "Date"
FROM "Transaction" AS t
INNER JOIN "Category" AS c ON c.id = t.category_id
INNER JOIN "Account" AS a ON a.id = t.account_id;

*/