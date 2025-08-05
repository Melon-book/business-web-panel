const fs = require('fs');
const path = require('path');

const folders = [
  'src/assets',
  'src/components/Calendar',
  'src/components/Charts',
  'src/components/Tables',
  'src/constants',
  'src/contexts',
  'src/features/appointments/components',
  'src/features/appointments/pages',
  'src/features/staff/components',
  'src/features/staff/pages',
  'src/features/clients/components',
  'src/features/clients/pages',
  'src/features/services/components',
  'src/features/services/pages',
  'src/features/schedule/components',
  'src/features/schedule/pages',
  'src/features/settings/components',
  'src/features/settings/pages',
  'src/features/analytics/components',
  'src/features/analytics/pages',
  'src/hooks',
  'src/i18n',
  'src/layouts',
  'src/lib',
  'src/pages/dashboard',
  'src/pages/login',
  'src/pages/register',
  'src/pages/error',
  'src/permissions',
  'src/routes',
  'src/services',
  'src/state',
  'src/styles',
  'src/theme',
  'src/types'
];

const createFolderStructure = () => {
  folders.forEach(folder => {
    const fullPath = path.join(process.cwd(), folder);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const gitkeepPath = path.join(fullPath, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  });

  console.log('Folder structure created successfully!');
};

createFolderStructure();
