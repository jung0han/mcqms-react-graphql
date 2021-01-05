function links(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links();
}

function newParts(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .newParts();
}

module.exports = {
  links,
  newParts,
};
