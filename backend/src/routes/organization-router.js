const express = require('express');
const { OrganizationController } = require('../controllers');

const router = express.Router();
const organizationController = new OrganizationController();

router.get('/:id', organizationController.getOrganization);

module.exports = router;