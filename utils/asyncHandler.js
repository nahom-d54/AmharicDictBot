const asyncHandler = (fn) => (ctx, next) =>
  Promise.resolve(fn(req, next)).catch(next);
