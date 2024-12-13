
import { injectIntl } from 'react-intl';
import { withNavigation } from '@remyar/react-navigation';
import { withStoreProvider } from '@remyar/react-store';
import { withSnackBar } from '@remyar/react-snackbar';

function HomePage(props) {
    const intl = props.intl;
    return <>
    dgdgdrge
    </>;
}

export default withStoreProvider(withNavigation(withSnackBar(injectIntl(HomePage))));