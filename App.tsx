/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	Pressable
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { QrCamera, Tools } from './QrMobileCamera';

const REACT_PAGE = 1;
const CAMERA_PAGE = 2;

export const App = ({ }) => {
	const [page, set_page] = React.useState(REACT_PAGE);

	function onCommand(action) {
		console.log(action)
		if (action == 'open_camera')
			set_page(CAMERA_PAGE)
		else
			set_page(REACT_PAGE)
	}

	// render
	return (
		<NavigationContainer>
			{
				(page == CAMERA_PAGE) ?
					<QrCamera onCommand={onCommand} />
					:
					<RNIntro onCommand={onCommand} />
			}
		</NavigationContainer>
	)

}



type SectionProps = PropsWithChildren<{
	title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	return (
		<View style={styles.sectionContainer}>
			<Text
				style={[
					styles.sectionTitle,
					{
						color: isDarkMode ? Colors.white : Colors.black,
					},
				]}>
				{title}
			</Text>
			<Text
				style={[
					styles.sectionDescription,
					{
						color: isDarkMode ? Colors.light : Colors.dark,
					},
				]}>
				{children}
			</Text>
		</View>
	);
}





function RNIntro({ onCommand = undefined }): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	function openCameraPage() {
		console.log("openCameraPage")
		if (onCommand)
			Tools._call(onCommand, 'open_camera')
	}

	/*
	 * To keep the template simple and small we're adding padding to prevent view
	 * from rendering under the System UI.
	 * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
	 * https://github.com/AppAndFlow/react-native-safe-area-context
	 *
	 * You can read more about it here:
	 * https://github.com/react-native-community/discussions-and-proposals/discussions/827
	 */
	const safePadding = '5%';

	return (
		<View style={backgroundStyle}>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<ScrollView
				style={backgroundStyle}>
				<View style={{ paddingRight: safePadding }}>
					<Header />
				</View>
				<View
					style={{
						backgroundColor: isDarkMode ? Colors.black : Colors.white,
						paddingHorizontal: safePadding,
						paddingBottom: safePadding,
					}}>
					<Section title="Camera Test">
						Click the button to go to the camera test page
					</Section>

					<Pressable style={styles.defaultButton} onPress={openCameraPage}>
						<Text>
							{"Camera Page"}
						</Text >
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
	defaultButton: {
		flexDirection: "row",
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 10,
		paddingTop: 5, paddingBottom: 5,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: '#1D97A9',
		marginEnd: 5,
		width: 150
	},
});

export default App;
