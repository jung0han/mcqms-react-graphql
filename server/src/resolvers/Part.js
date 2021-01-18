function addedBy(parent, args, context) {
  return context.prisma.part.findUnique({ where: { id: parent.id } }).addedBy();
}

module.exports = {
  addedBy,
};
