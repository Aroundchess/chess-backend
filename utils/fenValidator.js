function validateFEN(fen) {
  if (!fen || typeof fen !== 'string') {
    return { isValid: false, error: 'FEN must be a non-empty string' };
  }

  const parts = fen.trim().split(' ');

  // Basic FEN should have at least the board position
  if (parts.length < 1) {
    return { isValid: false, error: 'FEN format is incomplete' };
  }

  const boardPosition = parts[0];

  // Validate board position
  const ranks = boardPosition.split('/');
  if (ranks.length !== 8) {
    return { isValid: false, error: 'FEN must contain exactly 8 ranks separated by /' };
  }

  // Valid pieces in FEN notation
  const validPieces = /^[rnbqkpRNBQKP1-8]+$/;

  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];

    if (!validPieces.test(rank)) {
      return { isValid: false, error: `Invalid characters in rank ${i + 1}` };
    }

    // Count squares in rank (pieces + empty squares)
    let squareCount = 0;
    for (const char of rank) {
      if (/[1-8]/.test(char)) {
        squareCount += parseInt(char);
      } else if (/[rnbqkpRNBQKP]/.test(char)) {
        squareCount += 1;
      }
    }

    if (squareCount !== 8) {
      return { isValid: false, error: `Rank ${i + 1} must contain exactly 8 squares, found ${squareCount}` };
    }
  }

  // Validate other FEN parts if present
  if (parts.length >= 2) {
    const activeColor = parts[1];
    if (activeColor !== 'w' && activeColor !== 'b') {
      return { isValid: false, error: 'Active color must be "w" or "b"' };
    }
  }

  if (parts.length >= 3) {
    const castling = parts[2];
    if (!/^(-|[KQkq]+)$/.test(castling)) {
      return { isValid: false, error: 'Invalid castling rights format' };
    }
  }

  if (parts.length >= 4) {
    const enPassant = parts[3];
    if (enPassant !== '-' && !/^[a-h][36]$/.test(enPassant)) {
      return { isValid: false, error: 'Invalid en passant target square' };
    }
  }

  if (parts.length >= 5) {
    const halfmove = parts[4];
    if (!/^\d+$/.test(halfmove)) {
      return { isValid: false, error: 'Halfmove clock must be a number' };
    }
  }

  if (parts.length >= 6) {
    const fullmove = parts[5];
    if (!/^\d+$/.test(fullmove) || parseInt(fullmove) < 1) {
      return { isValid: false, error: 'Fullmove number must be a positive integer' };
    }
  }

  return { isValid: true };
}

module.exports = { validateFEN };