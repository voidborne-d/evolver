import {registerRoot} from 'remotion';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import Milestones from './Milestones';
import MilestonesV2 from './MilestonesV2';
import MilestonesFinal from './MilestonesFinal';
import MilestonesFinalCN from './MilestonesFinalCN';

export const RemotionRoot = () => {
	return (
		<>
			<Composition
				id="EvolutionSequence"
				component={MyComposition}
				durationInFrames={400}
				fps={30}
				width={1920}
				height={1080}
			/>
            <Composition
				id="MilestonesCard"
				component={Milestones}
				durationInFrames={1}
				fps={30}
				width={1600}
				height={2000} 
			/>
            <Composition
				id="MilestonesCardV2"
				component={MilestonesV2}
				durationInFrames={1}
				fps={30}
				width={1800}
				height={2400} 
			/>
            <Composition
				id="MilestonesFinal"
				component={MilestonesFinal}
				durationInFrames={1}
				fps={30}
				width={1900}
				height={2600} 
			/>
            <Composition
				id="MilestonesFinalCN"
				component={MilestonesFinalCN}
				durationInFrames={1}
				fps={30}
				width={1000} 
				height={2500} 
			/>
		</>
	);
};

registerRoot(RemotionRoot);
