import prisma from '../../config/db';
import { SettingGroup } from '@prisma/client';

export class SettingsService {
  static async getPublicSettings() {
    const settings = await prisma.websiteSetting.findMany();
    // Return key-value dictionary grouped or flat
    const dict: Record<string, string> = {};
    for (const item of settings) {
      dict[item.key] = item.value;
    }
    return dict;
  }

  static async getAllSettings() {
    return prisma.websiteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
  }

  static async updateBulkSettings(items: { key: string; value: string; group?: SettingGroup }[]) {
    const upserts = items.map((item) =>
      prisma.websiteSetting.upsert({
        where: { key: item.key },
        update: { value: item.value, group: item.group },
        create: { key: item.key, value: item.value, group: item.group || SettingGroup.GENERAL },
      })
    );

    await prisma.$transaction(upserts);
    return this.getPublicSettings();
  }
}
