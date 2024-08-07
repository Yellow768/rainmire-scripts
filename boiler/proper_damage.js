function damageFrom(targetEntity, srcEntity, amount) {
    var source = srcEntity.getMCEntity().m_269291_()
    var damageSource = source.m_269333_(srcEntity.getMCEntity())
    targetEntity.getMCEntity().m_6469_(damageSource, amount)
}