import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
	Camera,
	useCameraDevice,
	useCodeScanner,
} from "react-native-vision-camera";
import { NavigationContext, useFocusEffect } from '@react-navigation/native';

let debug = true;
let mod = "QrCamera: ";
let _working = false; // for timeout operation
const canScan = true;
const dir = 'ltr';
const bigIcon = 30;
const mediumIcon = 25;
const smallIcon = 15;
const ICON_back = undefined;
const brandGreen = '#43991c';
const brandBlue = '#1D97A9';
const defaultBackground = "white";
const transparent = "clear";

let openInterval = undefined;
function stopTimer() {
	if (openInterval) {
		clearTimeout(openInterval);
		openInterval = undefined;
	}
}


export const QrCamera = ({ onCommand }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [CameraOff, setCameraOff] = React.useState(true);
	const [working, set_working] = React.useState(false);
	const [qrcode, set_qrcode] = React.useState(undefined);
	// Camera Ops
	const [hasPermission, setHasPermission] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const device = useCameraDevice("back");
	const codeScanner = useCodeScanner({
		codeTypes: ["qr"],
		onCodeScanned: (codes) => {
			if (debug) {
				console.log(`onCodeScanned `, codes);
				console.log(`onCodeScanned value`, codes[0].value);
			}
			if (codes && codes.length > 0)
				openQrCode(codes[0].value)
		},
	});

	useEffect(() => {
		// exception case
		setRefresh(!refresh);
	}, [device, hasPermission]);

	useEffect(() => {
		const requestCameraPermission = async () => {
			const permission = await Camera.requestCameraPermission();
			if (debug) console.log(mod + "Camera.requestCameraPermission ", permission);
			setHasPermission(permission === "granted");
		};

		requestCameraPermission();

		//if it is idle for 15 secs, it will be closed
		openInterval = setTimeout(() => {
			if (debug) console.log(mod + "Timer expired ");
			if (!_working)
				CloseView();
			else
				stopTimer();
		}, 15 * 1000);
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			if (debug) console.log(mod + "getFocus "
				+ " canScan=" + canScan
				+ " hasPermission=" + hasPermission);
			_set_working(false);
			setCameraOff(false);
			setIsLoading(false);
			return () => {
				if (debug) console.log(mod + "LostFocus");
				setIsLoading(true);
				setCameraOff(true);
			};
		}, [])
	);

	function _set_working(working) {
		set_working(working);
		// update global variable for timer to work
		_working = working;
	}


	function CloseView() {
		if (debug) console.log(mod + 'CloseView');
		stopTimer();
		Tools._call(onCommand, 'close')
	}

	function openQrCode(url) {
		if (url) {
			set_qrcode(url);
			setCameraOff(true);
			console.log(mod + 'openQrCode ', url);
			const qr_code = url; // QrCodes.getCodeFromURL(url);
			if (qr_code) {
				if (debug) console.log(mod + 'validateQrCode(' + qr_code + ')');
			}
		}
	}


	const highlight = {
		fontSize: size_title,
		fontWeight: 'bold',
	};

	const qr_view_style = {
		width: "100%",
		flexDirection: 'column',
		alignContent: "center",
		justifyContent: "center"
	};

	const textStyle = [{
		width: "100%",
		textAlign: 'center', writingDirection: dir,
		padding: 5,
		paddingBottom: 10,
	}];

	if (isLoading)
		return (null);

	if (debug) console.log(mod + "render "
		+ " canScan=" + canScan
		+ " hasPermission=" + hasPermission);


	if (device == null || !hasPermission) {
		const msg = (device == null)
			? nls.QrNoCamera[lang]
			: nls.hlp_camera_permission[lang]
		return (
			<UI_Tools.TabPage>
				<UI_Tools.PageTitle
					icon={ICON_back}
					onPress={CloseView}
					iconSize={bigIcon}
					title={nls.qr_code[lang]}
					backgroundColor={brandGreen}
				/>
				<UI_Tools.ColorText style={{ backgroundColor: transparent, padding: 20 }}>
					{msg}
				</UI_Tools.ColorText >
			</UI_Tools.TabPage>
		);
	}


	return (
		<UI_Tools.TabPage containerStyle={[
			styles.full_wdth_Scroll,
			{ flex: 1, backgroundColor: defaultBackground }]
		}>
			<UI_Tools.PageTitle
				icon={Icons.ICON_back}
				onPress={CloseView}
				iconSize={bigIcon}
				title={nls.qr_code[lang]}
				backgroundColor={brandGreen}
			/>

			{CameraOff ?
				working ?
					<View style={[qr_view_style, { alignItems: "center", }]}>
						<UI_Tools.ColorText style={textStyle}>
							{nls.hlp_checking[lang]}
						</UI_Tools.ColorText>
					</View>
					:
					<View style={[qr_view_style, { alignItems: "center", }]}>
						<UI_Tools.ColorText style={textStyle}>
							{qrcode}
						</UI_Tools.ColorText>
					</View>
				:
				hasPermission ?
					<View style={[qr_view_style,
						{ overflow: 'hidden', alignItems: "center", }]}>
						<UI_Tools.ColorText style={textStyle}>
							{nls.hlp_scanning[lang]}
						</UI_Tools.ColorText>
						<Camera
							codeScanner={codeScanner}
							style={{ width: "100%", height: 500 }}
							device={device}
							isActive={true}
						/>
					</View>
					:
					null
			}

		</UI_Tools.TabPage>
	);
};





export const UI_Tools = {
	TabPage: (props) => {
		const {
			onPress = undefined,
			marginTop = false,
			containerStyle = {},
		} = props;

		return (
			<View
				style={[
					styles.form,
					{
						writingDirection: dir,
						marginTop: 0,
					},
					containerStyle]}>

				{props.children}

			</View>
		)
	},

	PageTitle: (props) => {
		const {
			icon = undefined,
			onPress = null,
			iconSize = bigIcon,
			title = '??',
			backgroundColor = brandGreen,
		} = props;

		return (
			<View style={{
				margin: 0,
				flexDirection: 'row',
				alignItems: 'flex-start',
				justifyContent: "space-between",
				writingDirection: dir,
				width: '100%',
				paddingEnd: 9,
				backgroundColor: backgroundColor,
			}}>
				<UI_Tools.ColorText
					style={[styles.header,
					{ color: 'white', width: "90%", backgroundColor: backgroundColor }
					]} >
					{title}
				</UI_Tools.ColorText >
				<UI_Tools.IconButton
					onPress={() => Tools._call(onPress)}
					icon={icon}
					iconSize={iconSize}
					iconColor={backgroundColor}
				/>
			</View>
		)
	},

	ColorText: (props) => {
		const {
			style = {},
		} = props;
		return (
			<Text style={[
				{ writingDirection: dir },
				style
			]}>
				{props.children}
			</Text >
		)
	},

	IconButton: (props) => {
		const {
			onPress,
			blink = false,
			icon = Icons.ICON_close,
			iconTextColor = 'white',
			iconColor = brandBlue,
			iconSize = smallIcon,
			containerStyle = {},
			margin = 3,
		} = props;
		const [TextColor, setTextColor] = React.useState(iconTextColor);
		let show = true;
		const debug = false;

		React.useEffect(() => {
			if (debug) console.log(mod + 'IconButton.mount');
			let interval = undefined;
			if (blink)
				interval = setInterval(() => {
					show = !show;
					if (debug) console.log(mod + 'IconButton.blink show=' + show);
					setTextColor(show ? iconTextColor : iconColor);
				}, 1000);
			return () => {
				// Anything in here is fired on component unmount.
				if (interval) {
					clearInterval(interval);
					interval = undefined;
				}
				if (debug) console.log(mod + 'IconButton.unmount');
			}
		}, []);

		if (debug) console.log(mod + 'IconButton.render');

		return (
			<Pressable
				style={[
					styles.defaultIconButton,
					{ backgroundColor: iconColor, margin: margin },
					containerStyle]}
				onPress={onPress}>
				<Ionicons name={icon} size={iconSize} color={TextColor} />
			</Pressable>
		);
	},


} // UI_Tools



const ARABIC = 1;
const ENGLISH = 0;
export var lang = ENGLISH;

export const nls = {
	qr_code: ['QR code', 'رمز الاستجابة السريعة'],
	QrNoCamera: [
		"Camera functions are not enabled on this device.",
		"لم يتم تمكين وظائف الكاميرا على هذا الجهاز. "
	],
	hlp_checking: ["Checking.....", "التحقق من الصحة ....."],
	hlp_camera_permission: [
		'Camera permission is required to scan the QR code.'
		+ ' Please grant permission.',
		"مطلوب إذن الكاميرا لمسح رمز الاستجابة السريعة."
		+ 'الرجاء منح الإذن.',
	],
	action_permission: [
		"Request Permission",
		"طلب إذن"
	],
	hlp_scanning: [
		"Scanning for Qr Cdoe.....",
		"جاري مسح رمز الاستجابة السريعة....."
	],

} // NLS

const white = 'white';
const title_margin = 10; // margin between fields
const size_title = 20;

const styles = StyleSheet.create({
	full_wdth_Scroll: {
		flex: 1,
		flexGrow: 1,
		width: "100%",
		height: "100%"
	},
	form: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	header: {
		backgroundColor: white,
		color: 'black',
		fontSize: size_title,
		fontWeight: 'bold',
		flexDirection: 'row',
		alignSelf: "stretch",
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		padding: title_margin
	},
});


export const Icons = {
	ICON_back: "caret-back",
}

export const Tools = {
	_call: function (callback, params, param2, param3, param4) {
		if (callback == undefined) {
			if (debug) {
				console.log(mod + "_callback - missing!!");
				//console.trace();
			}
		} else {
			return callback(params, param2, param3, param4);
		}
	},
}