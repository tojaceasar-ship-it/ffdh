// pnpmfile.cjs - Optional pnpm hooks
// This file can be used to customize package installation

function readPackage(pkg, context) {
  // Example: Ensure consistent versions
  // if (pkg.dependencies && pkg.dependencies['some-package']) {
  //   pkg.dependencies['some-package'] = '^1.0.0';
  // }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};

