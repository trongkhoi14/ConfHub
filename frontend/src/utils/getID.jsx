const getIdFromPathname = (pathname) => {
    const idMatch = pathname.match(/\/detail\/([^\/]+)/);
    return idMatch ? idMatch[1] : null;
  };

export {getIdFromPathname}