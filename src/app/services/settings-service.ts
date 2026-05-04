import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { AlertService } from './alert-service';

export enum SettingsTypeEnum {
	DevTicketFilter = 0
}

@Injectable({
	providedIn: 'root',
})
export class SettingsService {

	constructor(
		private _apiService: ApiService,
		private _alertService: AlertService) { }

	async saveSettingsAsync(settingsType: SettingsTypeEnum, settingsData: any) {
		const api = '/saveSettings';
		const body = {
			settingsType: settingsType,
			settingsData: JSON.stringify(settingsData)
		}
		try {
			await this._apiService.post(api, body);
		}
		catch (error) {
			this._alertService.show(String(error), 'failed');
			console.log(`saveSettingsAsync(): ${error}`);
		}
	}

	async getSettingsAsync<T>(settingsType: SettingsTypeEnum): Promise<T | null> {
		const api = `/getSettings/${settingsType}`;
		try {
			const response = await this._apiService.get<{ settings: string }>(api);
			return JSON.parse(response.settings);
		}
		catch (error) {
			this._alertService.show(String(error), 'failed');
			console.log(`saveSettingsAsync(): ${error}`);
		}
		return null;
	}
}
