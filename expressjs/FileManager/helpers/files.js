"use strict";

exports.formatSize = function(sizeInBytes) {
  return (sizeInBytes / 1024).toFixed(2) + ' kb';
};