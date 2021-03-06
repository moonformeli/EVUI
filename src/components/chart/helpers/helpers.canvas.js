export default {
  calculateX(value, min, max, area, startPoint = 0) {
    if (value === null) {
      return null;
    }

    if (value > max || value < min) {
      return null;
    }

    const scalingFactor = area / (max - min);
    return Math.ceil(startPoint + (scalingFactor * (value - min)));
  },

  calculateSubX(value, min, max, area, startPoint = 0) {
    if (value === null) {
      return null;
    }

    const scalingFactor = area / (max - min);
    return Math.ceil(startPoint + (scalingFactor * (value - min)));
  },

  calculateY(value, min, max, area, startPoint = 0) {
    let calcY;

    if (value === null) {
      return null;
    }

    if (value > max || value < min) {
      return null;
    }
    // Bar차트의 fillRect처리를 위해 invert값 추가 하여 Y값을 처리
    const scalingFactor = area / (max - min);
    if (startPoint) {
      calcY = startPoint - (scalingFactor * (value - (min || 0)));
    } else {
      calcY = -(scalingFactor * (value - (min || 0)));
    }
    return Math.floor(calcY);
  },

  drawPoint(ctx, style, radius, x, y) {
    let edgeLength;
    let xOffset;
    let yOffset;
    let height;
    let size;

    if (isNaN(radius) || radius <= 0) {
      return;
    }

    let offset;
    let leftX;
    let topY;
    let sideSize;

    switch (style) {
      // Default includes circle
      case 'triangle':
        ctx.beginPath();
        edgeLength = (3 * radius) / Math.sqrt(3);
        height = (edgeLength * Math.sqrt(3)) / 2;
        ctx.moveTo(x - (edgeLength / 2), y + (height / 3));
        ctx.lineTo(x + (edgeLength / 2), y + (height / 3));
        ctx.lineTo(x, y - ((2 * height) / 3));
        ctx.closePath();
        ctx.fill();
        break;
      case 'rect':
        size = (1 / Math.SQRT2) * radius;
        ctx.beginPath();
        ctx.fillRect(x - size, y - size, 2 * size, 2 * size);
        ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);
        break;
      case 'rectRounded':
        offset = radius / Math.SQRT2;
        leftX = x - offset;
        topY = y - offset;
        sideSize = Math.SQRT2 * radius;
        ctx.beginPath();
        this.roundedRect(ctx, leftX, topY, sideSize, sideSize, radius / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'rectRot':
        size = (1 / Math.SQRT2) * radius;
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y - size);
        ctx.closePath();
        ctx.fill();
        break;
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y - radius);
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();
        break;
      case 'crossRot':
        ctx.beginPath();
        xOffset = Math.cos(Math.PI / 4) * radius;
        yOffset = Math.sin(Math.PI / 4) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x - xOffset, y + yOffset);
        ctx.lineTo(x + xOffset, y - yOffset);
        ctx.closePath();
        break;
      case 'star':
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y - radius);
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        xOffset = Math.cos(Math.PI / 4) * radius;
        yOffset = Math.sin(Math.PI / 4) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x - xOffset, y + yOffset);
        ctx.lineTo(x + xOffset, y - yOffset);
        ctx.closePath();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();
        break;
      case 'dash':
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.stroke();
  },
  roundedRect(ctx, x, y, width, height, radius) {
    const pi = Math.PI;
    const halfPi = pi / 2;

    if (radius) {
      const r = Math.min(radius, height / 2, width / 2);
      const left = x + r;
      const top = y + r;
      const right = (x + width) - r;
      const bottom = (y + height) - r;

      ctx.moveTo(x, top);
      if (left < right && top < bottom) {
        ctx.arc(left, top, r, -pi, -halfPi);
        ctx.arc(right, top, r, -halfPi, 0);
        ctx.arc(right, bottom, r, 0, halfPi);
        ctx.arc(left, bottom, r, halfPi, pi);
      } else if (left < right) {
        ctx.moveTo(left, y);
        ctx.arc(right, top, r, -halfPi, halfPi);
        ctx.arc(left, top, r, halfPi, pi + halfPi);
      } else if (top < bottom) {
        ctx.arc(left, top, r, -pi, 0);
        ctx.arc(left, bottom, r, 0, pi);
      } else {
        ctx.arc(left, top, r, -pi, pi);
      }
      ctx.closePath();
      ctx.moveTo(x, y);
    } else {
      ctx.rect(x, y, width, height);
    }
  },
};
