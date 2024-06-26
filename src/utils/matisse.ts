// This utility file deals with images

import html2canvas from 'html2canvas';

import { Utils } from './utils';

export class Matisse {
	public static takeScreenshot(elementID: string) {
		const element = document.getElementById(elementID);
		if (element) {
			html2canvas(element).then(canvas => Utils.saveImage('image.png', canvas));
		}
	}
}
