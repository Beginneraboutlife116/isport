import styled from './styles.module.scss';

function Plan() {
	return (
		<div className={styled.container}>
			<div className={styled.container__course}>
				<span>8堂方案</span>
			</div>

			<div className={styled.container__price}>
				<span>NT$ 3,000</span>
				<button className={styled['container__price--button']}>購買</button>
			</div>
		</div>
	);
}

export default Plan;
