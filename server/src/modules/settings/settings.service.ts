import prisma from '../../config/db';
import { SettingGroup } from '@prisma/client';

export class SettingsService {
  static async getPublicSettings() {
    const settings = await prisma.websiteSetting.findMany();
    // Return key-value dictionary grouped or flat
    const defaults: Record<string, string> = {
      tmt_base_rate_per_mt: '52000',
      structural_base_rate_per_mt: '54000',
      plates_base_rate_per_mt: '56000',
      pipes_base_rate_per_mt: '55000',
      default_steel_rate_per_mt: '52500',
      gst_rate_percent: '18',
    };

    const dict: Record<string, string> = { ...defaults };
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
