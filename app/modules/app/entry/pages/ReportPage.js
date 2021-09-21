import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Table, Header, Container, Dimmer, Loader } from 'semantic-ui-react';
import Pagination from 'components/Pagination';
import { entryListRequest } from '../../entry/redux/actions';
import { makeSelectEntryList, makeSelectEntryListLoading } from '../../entry/redux/selectors';

class ReportPage extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      page: 1,
      pageSize: 10,
    };
  }

  componentWillMount() {
    this.props.entryList();
  }

  onChangePage = (page) => {
    this.setState({ page });
  }

  renderEntries = () => {
    const { entries } = this.props;
    const { page, pageSize } = this.state;

    if (!entries.size) {
      return (
        <Table.Row>
          <Table.Cell colSpan="3">
            No Entries
          </Table.Cell>
        </Table.Row>
      );
    }

    return entries.slice((page - 1) * pageSize, page * pageSize).map((entry, index) => (
      <Table.Row key={`report_${index}`}>
        <Table.Cell>
          {entry.get('Name')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Timezone')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Day of Week')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Available at')}
        </Table.Cell>
        <Table.Cell>
          {entry.get('Available until')}
        </Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    const { entries, loading } = this.props;
    const { page, pageSize } = this.state;

    return (
      <Container>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <Header as="h2" content="Weekly Report" />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Timezone</Table.HeaderCell>
              <Table.HeaderCell>Day of Week</Table.HeaderCell>
              <Table.HeaderCell>Available at</Table.HeaderCell>
              <Table.HeaderCell>Available until</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderEntries()}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <Pagination
                  total={entries.size}
                  currentPage={page}
                  onChange={this.onChangePage}
                  perPage={pageSize}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  entries: makeSelectEntryList(),
  loading: makeSelectEntryListLoading(),
});

const mapDispatchToProps = {
  entryList: entryListRequest,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ReportPage);
