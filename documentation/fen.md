This below is an detailed description and explanation of the Chess FEN (Forsyth-Edwards Notation), which is a standard notation.

From White’s perspective, you start with the top left and go just like you were reading a book in English: left to right, left to right, continuing all the way down the chessboard.

Each type of chess piece uses the same notation as PGN:
	•	Rook = R
	•	Knight = N
	•	Bishop = B
	•	Queen = Q
	•	King = K

For Black pieces in FEN, all of these are lowercase. For White pieces, they are uppercase. That’s how you can tell the sides apart.

⸻

Reading the Board

You literally go left to right, starting from the top left square, naming each piece or space.
	•	If it’s a piece, write its symbol.
	•	If it’s empty squares, use a number showing how many in a row.

It’s easier with an example:
A FEN string is one long strand of text, but it’s broken into eight parts, one for each rank.
	•	Start with the 8th rank, then add a slash.
	•	Then the 7th rank, another slash.
	•	Continue until the 1st rank.

⸻

Example: Starting Position
	•	On a8, we have a Black rook → r (lowercase since it’s Black). If it were White, it would be R.
	•	Then n for knight, b for bishop, q for queen, k for king, etc.
	•	After the back rank, place a slash.

For the 7th rank, we have eight Black pawns → pppppppp.
For the 6th rank, which is empty, we write 8. The same for the 5th, 4th, and 3rd ranks.

On the 2nd rank, we have eight White pawns → PPPPPPPP.
On the 1st rank, we repeat the White back rank, but in uppercase.

That creates the starting FEN notation, a single strand of text.

⸻

Whose Move

After the position, add a space and write whose move it is:
	•	w = White to move
	•	b = Black to move

⸻

Castling Rights

Next comes castling rights:
	•	K = White can castle kingside
	•	Q = White can castle queenside
	•	k = Black can castle kingside
	•	q = Black can castle queenside

If a side moved the king or rook, they lose that castling right.
If neither side can castle, write a hyphen (-).

⸻

Other FEN Fields

The final three categories are less commonly used, but still part of FEN:
	1.	En passant target square (if available, even if not playable).
	2.	Halfmove clock – counts moves for the 50-move rule (resets after a pawn move or capture).
	3.	Fullmove number – counts the number of moves played in the game.

Personally, I usually ignore these three when writing FEN for casual analysis.

⸻

Example: A Middlegame Position

Here’s a practical example from a game I played in 2018.
	•	Start with White’s orientation (h1 is a light square, bottom right).
	•	Suppose the first rank has two empty squares, then a Black rook (r), then four empty squares, and then a White rook (R). That would be:
2r4R

Add a slash, move to the 2nd rank, and continue:
	•	pp1b3Q, etc.
	•	Always count the empty spaces as numbers.

This notation is concise: instead of writing every single square, you compress sequences of empty squares into numbers. Once you get the hang of it, it’s very efficient.

⸻

Final Touch

After recording the board, add:
	•	Whose move it is (w or b)
	•	Castling rights (KQkq or -)

That’s a complete FEN.

For example:
If White has lost both castling rights and Black also cannot castle, you’d simply add - after the move indicator.